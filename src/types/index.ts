// LTRA License Management System - Type Definitions

export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';
export type LicenseStatus = 'DRAFT' | 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
export type ApplicationType = 'NEW' | 'RENEW' | 'ADJUST' | 'REVOKE';
export type ResourceStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_USE' | 'REVOKED' | 'QUARANTINE';
export type SubscriberType = 'PREPAID' | 'POSTPAID';
export type ActivationStatus = 'ACTIVATED' | 'NOT_ACTIVATED';
export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ViolationStatus = 'NEW' | 'INVESTIGATING' | 'RESOLVED';

export interface EnterpriseType {
  id: string;
  code: string;
  name: string;
  status: Status;
  created_at: string;
}

export interface ServiceType {
  id: string;
  code: string;
  name: string;
  group_type: 'TELECOM' | 'VAS' | 'OTT';
  requires_license: boolean;
  status: Status;
}

export interface LicenseType {
  id: string;
  code: string;
  name: string;
  category: 'ENTERPRISE' | 'SERVICE' | 'RESOURCE';
  has_expiry: boolean;
  status: Status;
}

export interface ResourceType {
  id: string;
  code: string;
  name: string;
  format_rule: string;
  status: Status;
}

export interface Enterprise {
  id: string;
  name: string;
  tax_code: string;
  representative: string;
  enterprise_type_id: string;
  enterprise_type?: EnterpriseType;
  status: Status;
  created_at: string;
}

export interface License {
  id: string;
  license_number: string;
  enterprise_id: string;
  enterprise?: Enterprise;
  license_type_id: string;
  license_type?: LicenseType;
  issue_date: string;
  expiry_date: string;
  status: LicenseStatus;
  file_url?: string;
  created_at: string;
}

export interface Application {
  id: string;
  code: string;
  enterprise_id: string;
  enterprise?: Enterprise;
  license_id?: string;
  license?: License;
  type: ApplicationType;
  status: ApplicationStatus;
  workflow_step_id?: string;
  submission_date?: string;
  created_by: string;
  created_at: string;
}

export interface NumberRange {
  id: string;
  prefix: string;
  start_number: number;
  end_number: number;
  block_size: number;
  telco_id?: string;
  telco?: Enterprise;
  license_id?: string;
  license?: License;
  status: ResourceStatus;
  created_at: string;
  usage_percent?: number;
}

export interface Subscriber {
  id: string;
  msisdn: string;
  serial_number: string;
  telco_id: string;
  telco?: Enterprise;
  range_id: string;
  range?: NumberRange;
  sub_type: SubscriberType;
  activation_status: ActivationStatus;
  activation_date?: string;
  expiry_date?: string;
  status: Status;
  last_sync_at?: string;
}

export interface ComplianceViolation {
  id: string;
  detection_date: string;
  license_id?: string;
  license?: License;
  enterprise_id?: string;
  enterprise?: Enterprise;
  violation_type: string;
  description: string;
  severity: ViolationSeverity;
  status: ViolationStatus;
}

export interface SystemLog {
  id: string;
  action: string;
  actor: string;
  target_entity: string;
  target_id: string;
  details: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalActiveLicenses: number;
  totalNumberRanges: number;
  pendingApplications: number;
  newViolations: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
