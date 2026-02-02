// Role Management Data Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  roles as mockRoles,
  resources as mockResources,
  rolePermissions as mockRolePermissions,
  users as mockUsers,
  userRoles as mockUserRoles,
  getRoleById,
  getUserById,
  getRolesForUser,
  getPermissionsForRole,
} from '@/data/mockData';
import type { Role, Resource, RolePermission, User, UserRole, PermissionAction, PermissionScope } from '@/types';
import { message } from 'antd';

// In-memory stores
let rolesStore = [...mockRoles];
let rolePermissionsStore = [...mockRolePermissions];
let usersStore = [...mockUsers];
let userRolesStore = [...mockUserRoles];

// ============ Roles ============
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: async (): Promise<Role[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return rolesStore;
    },
  });
}

// ============ Resources ============
export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
};

export function useResources() {
  return useQuery({
    queryKey: resourceKeys.lists(),
    queryFn: async (): Promise<Resource[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockResources;
    },
  });
}

// ============ Role Permissions ============
export const rolePermissionKeys = {
  all: ['rolePermissions'] as const,
  lists: () => [...rolePermissionKeys.all, 'list'] as const,
  byRole: (roleId: string) => [...rolePermissionKeys.all, 'byRole', roleId] as const,
};

export function useRolePermissions() {
  return useQuery({
    queryKey: rolePermissionKeys.lists(),
    queryFn: async (): Promise<RolePermission[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return rolePermissionsStore.map(rp => ({
        ...rp,
        role: getRoleById(rp.role_id),
      }));
    },
  });
}

export function useRolePermissionsByRole(roleId: string) {
  return useQuery({
    queryKey: rolePermissionKeys.byRole(roleId),
    queryFn: async (): Promise<RolePermission[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return rolePermissionsStore.filter(rp => rp.role_id === roleId);
    },
    enabled: !!roleId,
  });
}

export interface CreatePermissionInput {
  role_id: string;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export function useCreateRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePermissionInput): Promise<RolePermission> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPermission: RolePermission = {
        id: String(rolePermissionsStore.length + 1),
        ...input,
      };
      
      rolePermissionsStore = [...rolePermissionsStore, newPermission];
      return newPermission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      message.success('Đã thêm quyền thành công');
    },
    onError: () => {
      message.error('Không thể thêm quyền');
    },
  });
}

export function useDeleteRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      rolePermissionsStore = rolePermissionsStore.filter(rp => rp.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      message.success('Đã xóa quyền thành công');
    },
    onError: () => {
      message.error('Không thể xóa quyền');
    },
  });
}

// ============ Users ============
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return usersStore.map(u => ({
        ...u,
        roles: getRolesForUser(u.id),
      }));
    },
  });
}

// ============ User Roles ============
export const userRoleKeys = {
  all: ['userRoles'] as const,
  lists: () => [...userRoleKeys.all, 'list'] as const,
  byUser: (userId: string) => [...userRoleKeys.all, 'byUser', userId] as const,
};

export function useUserRoles() {
  return useQuery({
    queryKey: userRoleKeys.lists(),
    queryFn: async (): Promise<UserRole[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return userRolesStore.map(ur => ({
        ...ur,
        user: getUserById(ur.user_id),
        role: getRoleById(ur.role_id),
      }));
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }): Promise<UserRole> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if already assigned
      const existing = userRolesStore.find(ur => ur.user_id === userId && ur.role_id === roleId);
      if (existing) {
        throw new Error('Người dùng đã có vai trò này');
      }
      
      const newUserRole: UserRole = {
        id: String(userRolesStore.length + 1),
        user_id: userId,
        role_id: roleId,
        created_at: new Date().toISOString(),
      };
      
      userRolesStore = [...userRolesStore, newUserRole];
      return newUserRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      message.success('Đã gán vai trò thành công');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Không thể gán vai trò');
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      userRolesStore = userRolesStore.filter(ur => !(ur.user_id === userId && ur.role_id === roleId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      message.success('Đã xóa vai trò thành công');
    },
    onError: () => {
      message.error('Không thể xóa vai trò');
    },
  });
}
