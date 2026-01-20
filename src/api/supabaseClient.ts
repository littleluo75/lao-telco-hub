// LTRA License Management System - Data Access Layer
// All DB calls go through typed functions here to allow swapping backend later

import { supabase } from '@/integrations/supabase/client';
import type {
  Application,
  ApplicationStatus,
  ApplicationType,
  Enterprise,
  License,
  LicenseType,
  EnterpriseType,
  ServiceType,
  NumberRange,
  Subscriber,
  ComplianceViolation,
  SystemLog,
} from '@/types';

// ============ Enterprise Types ============
export async function getEnterpriseTypes(): Promise<EnterpriseType[]> {
  const { data, error } = await supabase
    .from('enterprise_types')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as EnterpriseType[];
}

// ============ Service Types ============
export async function getServiceTypes(): Promise<ServiceType[]> {
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as ServiceType[];
}

// ============ License Types ============
export async function getLicenseTypes(): Promise<LicenseType[]> {
  const { data, error } = await supabase
    .from('license_types')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as LicenseType[];
}

// ============ Enterprises ============
export async function getEnterprises(): Promise<Enterprise[]> {
  const { data, error } = await supabase
    .from('enterprises')
    .select(`
      *,
      enterprise_type:enterprise_types(*)
    `)
    .order('name');
  
  if (error) throw error;
  return data.map(e => ({
    ...e,
    enterprise_type: e.enterprise_type || undefined,
  })) as Enterprise[];
}

export async function getEnterpriseById(id: string): Promise<Enterprise | null> {
  const { data, error } = await supabase
    .from('enterprises')
    .select(`
      *,
      enterprise_type:enterprise_types(*)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Enterprise | null;
}

// ============ Licenses ============
export async function getLicenses(): Promise<License[]> {
  const { data, error } = await supabase
    .from('licenses')
    .select(`
      *,
      enterprise:enterprises(*),
      license_type:license_types(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(l => ({
    ...l,
    enterprise: l.enterprise || undefined,
    license_type: l.license_type || undefined,
  })) as License[];
}

export async function getLicenseById(id: string): Promise<License | null> {
  const { data, error } = await supabase
    .from('licenses')
    .select(`
      *,
      enterprise:enterprises(*),
      license_type:license_types(*)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as License | null;
}

// ============ Applications ============
export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      enterprise:enterprises(*),
      license:licenses(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(a => ({
    ...a,
    type: a.type as ApplicationType,
    status: a.status as ApplicationStatus,
    enterprise: a.enterprise || undefined,
    license: a.license || undefined,
  })) as Application[];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      enterprise:enterprises(*),
      license:licenses(*)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Application | null;
}

export async function updateApplicationStatus(
  id: string, 
  status: ApplicationStatus,
  submissionDate?: string
): Promise<Application> {
  const updateData: Record<string, unknown> = { status };
  
  if (submissionDate) {
    updateData.submission_date = submissionDate;
  }
  
  const { data, error } = await supabase
    .from('applications')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      enterprise:enterprises(*),
      license:licenses(*)
    `)
    .single();
  
  if (error) throw error;
  return {
    ...data,
    type: data.type as ApplicationType,
    status: data.status as ApplicationStatus,
    enterprise: data.enterprise || undefined,
    license: data.license || undefined,
  } as Application;
}

export interface CreateApplicationInput {
  code: string;
  enterprise_id: string;
  license_id?: string;
  type: ApplicationType;
  status?: ApplicationStatus;
  created_by?: string;
}

export async function createApplication(input: CreateApplicationInput): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      code: input.code,
      enterprise_id: input.enterprise_id,
      license_id: input.license_id,
      type: input.type,
      status: input.status || 'DRAFT',
      created_by: input.created_by,
    })
    .select(`
      *,
      enterprise:enterprises(*),
      license:licenses(*)
    `)
    .single();
  
  if (error) throw error;
  return {
    ...data,
    type: data.type as ApplicationType,
    status: data.status as ApplicationStatus,
    enterprise: data.enterprise || undefined,
    license: data.license || undefined,
  } as Application;
}

// ============ Number Ranges ============
export async function getNumberRanges(): Promise<NumberRange[]> {
  const { data, error } = await supabase
    .from('number_ranges')
    .select(`
      *,
      telco:enterprises(*),
      license:licenses(*)
    `)
    .order('prefix');
  
  if (error) throw error;
  return data.map(nr => ({
    ...nr,
    telco: nr.telco || undefined,
    license: nr.license || undefined,
  })) as NumberRange[];
}

// ============ Subscribers ============
export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase
    .from('subscribers')
    .select(`
      *,
      telco:enterprises(*),
      range:number_ranges(*)
    `)
    .order('msisdn');
  
  if (error) throw error;
  return data.map(s => ({
    ...s,
    telco: s.telco || undefined,
    range: s.range || undefined,
  })) as Subscriber[];
}

/**
 * Sanitize user input for ILIKE patterns to prevent SQL pattern injection
 * Escapes special LIKE characters: %, _, \
 */
function sanitizeLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')     // Escape percent
    .replace(/_/g, '\\_');    // Escape underscore
}

/**
 * Validate search query input
 * Returns true if valid, false otherwise
 */
function isValidSearchQuery(query: string): boolean {
  // Allow alphanumeric, spaces, hyphens, and basic punctuation
  // Limit length to prevent abuse
  if (!query || query.length > 50) return false;
  return /^[a-zA-Z0-9\-_.\s]+$/.test(query);
}

export async function searchSubscribers(query: string): Promise<Subscriber[]> {
  // Validate input
  if (!isValidSearchQuery(query)) {
    return []; // Return empty array for invalid queries instead of throwing
  }
  
  // Sanitize the query for ILIKE pattern matching
  const sanitized = sanitizeLikePattern(query);
  
  const { data, error } = await supabase
    .from('subscribers')
    .select(`
      *,
      telco:enterprises(*),
      range:number_ranges(*)
    `)
    .or(`msisdn.ilike.%${sanitized}%,serial_number.ilike.%${sanitized}%`)
    .limit(50);
  
  if (error) throw error;
  return data.map(s => ({
    ...s,
    telco: s.telco || undefined,
    range: s.range || undefined,
  })) as Subscriber[];
}

// ============ Compliance Violations ============
export async function getViolations(): Promise<ComplianceViolation[]> {
  const { data, error } = await supabase
    .from('compliance_violations')
    .select(`
      *,
      license:licenses(*),
      enterprise:enterprises(*)
    `)
    .order('detection_date', { ascending: false });
  
  if (error) throw error;
  return data.map(v => ({
    ...v,
    license: v.license || undefined,
    enterprise: v.enterprise || undefined,
  })) as ComplianceViolation[];
}

// ============ System Logs ============
export async function getSystemLogs(): Promise<SystemLog[]> {
  const { data, error } = await supabase
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data as SystemLog[];
}

export async function createSystemLog(log: Omit<SystemLog, 'id' | 'created_at'>): Promise<SystemLog> {
  const { data, error } = await supabase
    .from('system_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) throw error;
  return data as SystemLog;
}

// ============ Dashboard Stats ============
export interface DashboardStats {
  totalActiveLicenses: number;
  totalNumberRanges: number;
  pendingApplications: number;
  newViolations: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [licensesResult, rangesResult, applicationsResult, violationsResult] = await Promise.all([
    supabase.from('licenses').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('number_ranges').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }).in('status', ['SUBMITTED', 'REVIEWING']),
    supabase.from('compliance_violations').select('id', { count: 'exact', head: true }).eq('status', 'NEW'),
  ]);

  return {
    totalActiveLicenses: licensesResult.count || 0,
    totalNumberRanges: rangesResult.count || 0,
    pendingApplications: applicationsResult.count || 0,
    newViolations: violationsResult.count || 0,
  };
}
