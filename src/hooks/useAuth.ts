import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'director' | 'reviewer' | 'staff';

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole | null;
  fullName: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (userId: string): Promise<AppRole | null> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error || !data) return null;
    return data.role as AppRole;
  }, []);

  const fetchUserProfile = useCallback(async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error || !data) return null;
    return data.full_name;
  }, []);

  const buildAuthUser = useCallback(async (supabaseUser: User): Promise<AuthUser> => {
    const [role, fullName] = await Promise.all([
      fetchUserRole(supabaseUser.id),
      fetchUserProfile(supabaseUser.id),
    ]);

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role,
      fullName,
    };
  }, [fetchUserRole, fetchUserProfile]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const authUser = await buildAuthUser(session.user);
        setUser(authUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const authUser = await buildAuthUser(session.user);
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [buildAuthUser]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const hasRole = (requiredRole: AppRole): boolean => {
    if (!user?.role) return false;
    
    const roleHierarchy: Record<AppRole, number> = {
      admin: 4,
      director: 3,
      reviewer: 2,
      staff: 1,
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAuthenticated: !!session,
  };
}
