// LTRA License Management System - Mock Data for Lao Telecom Context

import {
  Enterprise,
  EnterpriseType,
  LicenseType,
  ServiceType,
  License,
  Application,
  NumberRange,
  Subscriber,
  ComplianceViolation,
  SystemLog,
  DashboardStats,
  ChartData,
  Role,
  Resource,
  RolePermission,
  User,
  UserRole,
} from '@/types';

// Enterprise Types
export const enterpriseTypes: EnterpriseType[] = [
  { id: '1', code: 'TELCO', name: 'Nhà cung cấp viễn thông', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '2', code: 'ISP', name: 'Nhà cung cấp dịch vụ Internet', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '3', code: 'VAS', name: 'Nhà cung cấp dịch vụ giá trị gia tăng', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '4', code: 'OTT', name: 'Nhà cung cấp dịch vụ OTT', status: 'ACTIVE', created_at: '2024-01-01' },
];

// License Types
export const licenseTypes: LicenseType[] = [
  { id: '1', code: 'NET_LICENSE', name: 'Giấy phép thiết lập mạng viễn thông', category: 'ENTERPRISE', has_expiry: true, status: 'ACTIVE' },
  { id: '2', code: 'SVC_LICENSE', name: 'Giấy phép cung cấp dịch vụ', category: 'SERVICE', has_expiry: true, status: 'ACTIVE' },
  { id: '3', code: 'NUM_LICENSE', name: 'Giấy phép sử dụng kho số', category: 'RESOURCE', has_expiry: true, status: 'ACTIVE' },
  { id: '4', code: 'FREQ_LICENSE', name: 'Giấy phép sử dụng tần số', category: 'RESOURCE', has_expiry: true, status: 'ACTIVE' },
];

// Service Types
export const serviceTypes: ServiceType[] = [
  { id: '1', code: 'MOBILE', name: 'Dịch vụ di động', group_type: 'TELECOM', requires_license: true, status: 'ACTIVE' },
  { id: '2', code: 'FIXED', name: 'Dịch vụ cố định', group_type: 'TELECOM', requires_license: true, status: 'ACTIVE' },
  { id: '3', code: 'INTERNET', name: 'Dịch vụ Internet', group_type: 'TELECOM', requires_license: true, status: 'ACTIVE' },
  { id: '4', code: 'SMS', name: 'Dịch vụ tin nhắn', group_type: 'VAS', requires_license: true, status: 'ACTIVE' },
  { id: '5', code: 'STREAMING', name: 'Dịch vụ phát trực tuyến', group_type: 'OTT', requires_license: false, status: 'ACTIVE' },
];

// Enterprises (Lao Telcos)
export const enterprises: Enterprise[] = [
  { 
    id: '1', 
    name: 'Unitel (Star Telecom)', 
    tax_code: '0100123456789', 
    representative: 'Mr. Sommay Phomsoupha',
    enterprise_type_id: '1',
    status: 'ACTIVE', 
    created_at: '2020-01-15' 
  },
  { 
    id: '2', 
    name: 'LTC (Lao Telecom)', 
    tax_code: '0100234567890', 
    representative: 'Mr. Khammoune Viphongxay',
    enterprise_type_id: '1',
    status: 'ACTIVE', 
    created_at: '2019-06-20' 
  },
  { 
    id: '3', 
    name: 'ETL (Enterprise of Telecommunications Lao)', 
    tax_code: '0100345678901', 
    representative: 'Ms. Chanthaphone Phommachan',
    enterprise_type_id: '1',
    status: 'ACTIVE', 
    created_at: '2018-03-10' 
  },
  { 
    id: '4', 
    name: 'TPlus', 
    tax_code: '0100456789012', 
    representative: 'Mr. Bounleuth Sengsavang',
    enterprise_type_id: '1',
    status: 'ACTIVE', 
    created_at: '2021-08-05' 
  },
];

// Licenses
export const licenses: License[] = [
  {
    id: '1',
    license_number: 'GP-NET-2024-001',
    enterprise_id: '1',
    license_type_id: '1',
    issue_date: '2024-01-15',
    expiry_date: '2029-01-14',
    status: 'ACTIVE',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    license_number: 'GP-NET-2023-002',
    enterprise_id: '2',
    license_type_id: '1',
    issue_date: '2023-06-20',
    expiry_date: '2028-06-19',
    status: 'ACTIVE',
    created_at: '2023-06-20',
  },
  {
    id: '3',
    license_number: 'GP-SVC-2024-003',
    enterprise_id: '3',
    license_type_id: '2',
    issue_date: '2024-03-10',
    expiry_date: '2027-03-09',
    status: 'ACTIVE',
    created_at: '2024-03-10',
  },
  {
    id: '4',
    license_number: 'GP-NUM-2023-004',
    enterprise_id: '1',
    license_type_id: '3',
    issue_date: '2023-01-01',
    expiry_date: '2024-06-30',
    status: 'EXPIRED',
    created_at: '2023-01-01',
  },
  {
    id: '5',
    license_number: 'GP-NET-2024-005',
    enterprise_id: '4',
    license_type_id: '1',
    issue_date: '2024-08-05',
    expiry_date: '2029-08-04',
    status: 'ACTIVE',
    created_at: '2024-08-05',
  },
];

// Applications
export const applications: Application[] = [
  {
    id: '1',
    code: 'HS-2024-001',
    enterprise_id: '1',
    type: 'NEW',
    status: 'REVIEWING',
    submission_date: '2024-12-01',
    created_by: 'admin@ltra.gov.la',
    created_at: '2024-12-01',
  },
  {
    id: '2',
    code: 'HS-2024-002',
    enterprise_id: '2',
    license_id: '2',
    type: 'RENEW',
    status: 'DRAFT',
    created_by: 'admin@ltra.gov.la',
    created_at: '2024-12-10',
  },
  {
    id: '3',
    code: 'HS-2024-003',
    enterprise_id: '3',
    license_id: '3',
    type: 'ADJUST',
    status: 'APPROVED',
    submission_date: '2024-11-15',
    created_by: 'admin@ltra.gov.la',
    created_at: '2024-11-15',
  },
  {
    id: '4',
    code: 'HS-2024-004',
    enterprise_id: '4',
    type: 'NEW',
    status: 'SUBMITTED',
    submission_date: '2024-12-18',
    created_by: 'user@ltra.gov.la',
    created_at: '2024-12-18',
  },
];

// Number Ranges
export const numberRanges: NumberRange[] = [
  {
    id: '1',
    prefix: '0209',
    start_number: 20900000000,
    end_number: 20909999999,
    block_size: 10000000,
    telco_id: '1',
    license_id: '1',
    status: 'IN_USE',
    created_at: '2024-01-15',
    usage_percent: 72,
  },
  {
    id: '2',
    prefix: '0205',
    start_number: 20500000000,
    end_number: 20509999999,
    block_size: 10000000,
    telco_id: '2',
    license_id: '2',
    status: 'IN_USE',
    created_at: '2023-06-20',
    usage_percent: 58,
  },
  {
    id: '3',
    prefix: '0207',
    start_number: 20700000000,
    end_number: 20709999999,
    block_size: 10000000,
    telco_id: '3',
    status: 'ASSIGNED',
    created_at: '2024-03-10',
    usage_percent: 35,
  },
  {
    id: '4',
    prefix: '0208',
    start_number: 20800000000,
    end_number: 20809999999,
    block_size: 10000000,
    telco_id: '4',
    license_id: '5',
    status: 'IN_USE',
    created_at: '2024-08-05',
    usage_percent: 12,
  },
  {
    id: '5',
    prefix: '0206',
    start_number: 20600000000,
    end_number: 20609999999,
    block_size: 10000000,
    status: 'AVAILABLE',
    created_at: '2024-01-01',
    usage_percent: 0,
  },
];

// Subscribers (Sample)
export const subscribers: Subscriber[] = [
  {
    id: '1',
    msisdn: '02091234567',
    serial_number: 'SIM-UNI-001234',
    telco_id: '1',
    range_id: '1',
    sub_type: 'PREPAID',
    activation_status: 'ACTIVATED',
    activation_date: '2024-06-15',
    status: 'ACTIVE',
    last_sync_at: '2024-12-19',
  },
  {
    id: '2',
    msisdn: '02059876543',
    serial_number: 'SIM-LTC-005678',
    telco_id: '2',
    range_id: '2',
    sub_type: 'POSTPAID',
    activation_status: 'ACTIVATED',
    activation_date: '2024-01-20',
    status: 'ACTIVE',
    last_sync_at: '2024-12-19',
  },
  {
    id: '3',
    msisdn: '02075551234',
    serial_number: 'SIM-ETL-009012',
    telco_id: '3',
    range_id: '3',
    sub_type: 'PREPAID',
    activation_status: 'NOT_ACTIVATED',
    status: 'PENDING',
    last_sync_at: '2024-12-18',
  },
];

// Compliance Violations
export const violations: ComplianceViolation[] = [
  {
    id: '1',
    detection_date: '2024-12-15',
    license_id: '4',
    enterprise_id: '1',
    violation_type: 'License Expired but still active traffic',
    description: 'Phát hiện lưu lượng hoạt động trên giấy phép đã hết hạn GP-NUM-2023-004',
    severity: 'HIGH',
    status: 'NEW',
  },
  {
    id: '2',
    detection_date: '2024-12-10',
    enterprise_id: '3',
    violation_type: 'Unreported Number Range Usage',
    description: 'Dải số 0207 được sử dụng nhưng chưa báo cáo đầy đủ',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
  },
];

// System Logs
export const systemLogs: SystemLog[] = [
  {
    id: '1',
    action: 'CREATE_APPLICATION',
    actor: 'admin@ltra.gov.la',
    target_entity: 'applications',
    target_id: '1',
    details: 'Created new application HS-2024-001',
    created_at: '2024-12-01T09:30:00Z',
  },
  {
    id: '2',
    action: 'UPDATE_STATUS',
    actor: 'reviewer@ltra.gov.la',
    target_entity: 'applications',
    target_id: '1',
    details: 'Changed status from SUBMITTED to REVIEWING',
    created_at: '2024-12-02T14:15:00Z',
  },
  {
    id: '3',
    action: 'APPROVE_APPLICATION',
    actor: 'director@ltra.gov.la',
    target_entity: 'applications',
    target_id: '3',
    details: 'Approved application HS-2024-003',
    created_at: '2024-11-20T11:00:00Z',
  },
  {
    id: '4',
    action: 'ALLOCATE_RANGE',
    actor: 'admin@ltra.gov.la',
    target_entity: 'number_ranges',
    target_id: '4',
    details: 'Allocated range 0208 to TPlus',
    created_at: '2024-08-05T10:00:00Z',
  },
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalActiveLicenses: 4,
  totalNumberRanges: 5,
  pendingApplications: 2,
  newViolations: 1,
};

// Chart Data
export const licensesPerMonth: ChartData[] = [
  { name: 'Jan', value: 3 },
  { name: 'Feb', value: 2 },
  { name: 'Mar', value: 4 },
  { name: 'Apr', value: 1 },
  { name: 'May', value: 2 },
  { name: 'Jun', value: 5 },
  { name: 'Jul', value: 3 },
  { name: 'Aug', value: 4 },
  { name: 'Sep', value: 2 },
  { name: 'Oct', value: 3 },
  { name: 'Nov', value: 4 },
  { name: 'Dec', value: 2 },
];

export const marketShareData: ChartData[] = [
  { name: 'Unitel', value: 45, color: 'hsl(217, 91%, 50%)' },
  { name: 'LTC', value: 30, color: 'hsl(142, 70%, 45%)' },
  { name: 'ETL', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'TPlus', value: 10, color: 'hsl(280, 65%, 55%)' },
];

// Helper function to get enterprise by ID
export const getEnterpriseById = (id: string): Enterprise | undefined => {
  return enterprises.find(e => e.id === id);
};

// Helper function to get license type by ID
export const getLicenseTypeById = (id: string): LicenseType | undefined => {
  return licenseTypes.find(lt => lt.id === id);
};

// ============ Role Management Mock Data ============

// Roles
export const roles: Role[] = [
  { id: '1', name: 'Quản trị viên', code: 'admin', description: 'Toàn quyền quản lý hệ thống', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '2', name: 'Giám đốc', code: 'director', description: 'Phê duyệt hồ sơ và quyết định', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '3', name: 'Chuyên viên thẩm định', code: 'reviewer', description: 'Thẩm định và xem xét hồ sơ', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '4', name: 'Nhân viên', code: 'staff', description: 'Nhập liệu và xử lý hồ sơ', status: 'ACTIVE', created_at: '2024-01-01' },
];

// Resources
export const resources: Resource[] = [
  { id: '1', name: 'Người dùng', code: 'user', description: 'Quản lý người dùng hệ thống' },
  { id: '2', name: 'Vai trò', code: 'role', description: 'Quản lý vai trò và phân quyền' },
  { id: '3', name: 'Hồ sơ đề nghị', code: 'application', description: 'Quản lý hồ sơ đề nghị cấp phép' },
  { id: '4', name: 'Giấy phép', code: 'license', description: 'Quản lý giấy phép' },
  { id: '5', name: 'Dải số', code: 'number_range', description: 'Quản lý dải số viễn thông' },
  { id: '6', name: 'Thuê bao', code: 'subscriber', description: 'Tra cứu thông tin thuê bao' },
  { id: '7', name: 'Vi phạm', code: 'violation', description: 'Quản lý vi phạm tuân thủ' },
  { id: '8', name: 'Doanh nghiệp', code: 'enterprise', description: 'Quản lý thông tin doanh nghiệp' },
];

// Role Permissions
export const rolePermissions: RolePermission[] = [
  // Admin - full access
  { id: '1', role_id: '1', resource: 'user', action: 'read', scope: 'any' },
  { id: '2', role_id: '1', resource: 'user', action: 'create', scope: 'any' },
  { id: '3', role_id: '1', resource: 'user', action: 'edit', scope: 'any' },
  { id: '4', role_id: '1', resource: 'user', action: 'delete', scope: 'any' },
  { id: '5', role_id: '1', resource: 'role', action: 'read', scope: 'any' },
  { id: '6', role_id: '1', resource: 'role', action: 'create', scope: 'any' },
  { id: '7', role_id: '1', resource: 'role', action: 'edit', scope: 'any' },
  { id: '8', role_id: '1', resource: 'role', action: 'delete', scope: 'any' },
  { id: '9', role_id: '1', resource: 'application', action: 'read', scope: 'any' },
  { id: '10', role_id: '1', resource: 'application', action: 'create', scope: 'any' },
  { id: '11', role_id: '1', resource: 'application', action: 'edit', scope: 'any' },
  { id: '12', role_id: '1', resource: 'application', action: 'delete', scope: 'any' },
  // Director - approve/reject
  { id: '13', role_id: '2', resource: 'application', action: 'read', scope: 'any' },
  { id: '14', role_id: '2', resource: 'application', action: 'edit', scope: 'any' },
  { id: '15', role_id: '2', resource: 'license', action: 'read', scope: 'any' },
  { id: '16', role_id: '2', resource: 'license', action: 'create', scope: 'any' },
  { id: '17', role_id: '2', resource: 'user', action: 'read', scope: 'any' },
  // Reviewer - review
  { id: '18', role_id: '3', resource: 'application', action: 'read', scope: 'any' },
  { id: '19', role_id: '3', resource: 'application', action: 'edit', scope: 'any' },
  { id: '20', role_id: '3', resource: 'license', action: 'read', scope: 'any' },
  { id: '21', role_id: '3', resource: 'violation', action: 'read', scope: 'any' },
  { id: '22', role_id: '3', resource: 'violation', action: 'create', scope: 'any' },
  // Staff - basic operations
  { id: '23', role_id: '4', resource: 'application', action: 'read', scope: 'own' },
  { id: '24', role_id: '4', resource: 'application', action: 'create', scope: 'own' },
  { id: '25', role_id: '4', resource: 'application', action: 'edit', scope: 'own' },
  { id: '26', role_id: '4', resource: 'subscriber', action: 'read', scope: 'any' },
  { id: '27', role_id: '4', resource: 'enterprise', action: 'read', scope: 'any' },
];

// Users
export const users: User[] = [
  { id: '1', email: 'admin@ltra.gov.la', full_name: 'Nguyễn Văn Admin', status: 'ACTIVE', created_at: '2024-01-01' },
  { id: '2', email: 'director@ltra.gov.la', full_name: 'Trần Thị Giám Đốc', status: 'ACTIVE', created_at: '2024-01-15' },
  { id: '3', email: 'reviewer@ltra.gov.la', full_name: 'Lê Văn Thẩm Định', status: 'ACTIVE', created_at: '2024-02-01' },
  { id: '4', email: 'staff1@ltra.gov.la', full_name: 'Phạm Thị Nhân Viên', status: 'ACTIVE', created_at: '2024-02-15' },
  { id: '5', email: 'staff2@ltra.gov.la', full_name: 'Hoàng Văn Chuyên', status: 'INACTIVE', created_at: '2024-03-01' },
];

// User-Role assignments (many-to-many)
export const userRoles: UserRole[] = [
  { id: '1', user_id: '1', role_id: '1', created_at: '2024-01-01' },
  { id: '2', user_id: '2', role_id: '2', created_at: '2024-01-15' },
  { id: '3', user_id: '3', role_id: '3', created_at: '2024-02-01' },
  { id: '4', user_id: '4', role_id: '4', created_at: '2024-02-15' },
  { id: '5', user_id: '5', role_id: '4', created_at: '2024-03-01' },
  { id: '6', user_id: '1', role_id: '2', created_at: '2024-01-01' }, // Admin also has Director role
];

// Helper functions for role management
export const getRoleById = (id: string): Role | undefined => {
  return roles.find(r => r.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export const getRolesForUser = (userId: string): Role[] => {
  const roleIds = userRoles.filter(ur => ur.user_id === userId).map(ur => ur.role_id);
  return roles.filter(r => roleIds.includes(r.id));
};

export const getUsersForRole = (roleId: string): User[] => {
  const userIds = userRoles.filter(ur => ur.role_id === roleId).map(ur => ur.user_id);
  return users.filter(u => userIds.includes(u.id));
};

export const getPermissionsForRole = (roleId: string): RolePermission[] => {
  return rolePermissions.filter(rp => rp.role_id === roleId);
};
