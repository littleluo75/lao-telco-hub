import { useState, useMemo } from 'react';
import { Select, Space, Card, Checkbox, Tag, Tooltip, Spin } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  useRoles,
  useResources,
  useRolePermissions,
  useCreateRolePermission,
  useDeleteRolePermission,
} from '@/hooks/useRoleData';
import type { PermissionAction, PermissionScope } from '@/types';

const ACTIONS: { value: PermissionAction; label: string; color: string }[] = [
  { value: 'create', label: 'Tạo mới', color: 'green' },
  { value: 'read', label: 'Xem', color: 'blue' },
  { value: 'edit', label: 'Sửa', color: 'orange' },
  { value: 'delete', label: 'Xóa', color: 'red' },
];

const SCOPES: { value: PermissionScope; label: string }[] = [
  { value: 'own', label: 'Của mình' },
  { value: 'any', label: 'Tất cả' },
];

export default function RolePermissionsTab() {
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const { data: resources = [], isLoading: loadingResources } = useResources();
  const { data: permissions = [], isLoading: loadingPermissions } = useRolePermissions();
  const createPermission = useCreateRolePermission();
  const deletePermission = useDeleteRolePermission();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<PermissionScope>('any');

  // Get permission for a specific resource and action
  const getPermission = (resourceCode: string, action: PermissionAction) => {
    if (!selectedRole) return null;
    return permissions.find(
      (p) => p.role_id === selectedRole && p.resource === resourceCode && p.action === action
    );
  };

  const hasPermission = (resourceCode: string, action: PermissionAction) => {
    return !!getPermission(resourceCode, action);
  };

  const getPermissionScope = (resourceCode: string, action: PermissionAction): PermissionScope | null => {
    const perm = getPermission(resourceCode, action);
    return perm?.scope || null;
  };

  const handleTogglePermission = async (resourceCode: string, action: PermissionAction) => {
    if (!selectedRole) return;

    const existingPerm = getPermission(resourceCode, action);

    if (existingPerm) {
      // Remove permission
      deletePermission.mutate(existingPerm.id);
    } else {
      // Add permission
      createPermission.mutate({
        role_id: selectedRole,
        resource: resourceCode,
        action,
        scope: selectedScope,
      });
    }
  };

  const getRoleColor = (code: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      director: 'purple',
      reviewer: 'blue',
      staff: 'green',
    };
    return colors[code] || 'default';
  };

  const selectedRoleData = roles.find((r) => r.id === selectedRole);
  const isLoading = loadingRoles || loadingResources || loadingPermissions;
  const isMutating = createPermission.isPending || deletePermission.isPending;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Space>
          <span className="text-sm font-medium">Vai trò:</span>
          <Select
            placeholder="Chọn vai trò để phân quyền"
            style={{ width: 240 }}
            value={selectedRole}
            onChange={setSelectedRole}
            loading={loadingRoles}
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
          />
        </Space>
        <Space>
          <span className="text-sm font-medium">Phạm vi mặc định:</span>
          <Select
            style={{ width: 140 }}
            value={selectedScope}
            onChange={setSelectedScope}
            options={SCOPES.map((s) => ({ value: s.value, label: s.label }))}
          />
        </Space>
        {selectedRoleData && (
          <Tag color={getRoleColor(selectedRoleData.code)} className="ml-2">
            {selectedRoleData.name}
          </Tag>
        )}
      </div>

      {/* Permission Matrix */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : !selectedRole ? (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">Vui lòng chọn vai trò để xem và chỉnh sửa ma trận phân quyền</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold min-w-[200px]">Tài nguyên</th>
                {ACTIONS.map((action) => (
                  <th key={action.value} className="text-center p-3 font-semibold min-w-[100px]">
                    <Tag color={action.color}>{action.label}</Tag>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-xs text-muted-foreground">{resource.code}</div>
                    </div>
                  </td>
                  {ACTIONS.map((action) => {
                    const hasPerm = hasPermission(resource.code, action.value);
                    const scope = getPermissionScope(resource.code, action.value);
                    
                    return (
                      <td key={action.value} className="text-center p-3">
                        <Tooltip
                          title={
                            hasPerm
                              ? `${action.label}: ${scope === 'any' ? 'Tất cả' : 'Của mình'} - Click để xóa`
                              : `Click để thêm quyền ${action.label}`
                          }
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Checkbox
                              checked={hasPerm}
                              onChange={() => handleTogglePermission(resource.code, action.value)}
                              disabled={isMutating}
                            />
                            {hasPerm && (
                              <span className="text-xs text-muted-foreground">
                                {scope === 'any' ? 'Tất cả' : 'Của mình'}
                              </span>
                            )}
                          </div>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Legend */}
      <Card size="small" className="bg-muted/30">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Checkbox checked disabled />
            <span>Có quyền</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox disabled />
            <span>Không có quyền</span>
          </div>
          <div className="border-l border-border pl-6 flex items-center gap-2">
            <span className="font-medium">Phạm vi:</span>
            <Tag>Của mình</Tag>
            <span>- Chỉ dữ liệu do mình tạo</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag color="purple">Tất cả</Tag>
            <span>- Toàn bộ dữ liệu</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
