import { AppHeader } from '@/components/layout/AppHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable } from '@/components/common/DataTable';
import {
  FileText,
  Database,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  dashboardStats,
  applications,
  violations,
  licensesPerMonth,
  marketShareData,
  enterprises,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentApplications = applications.slice(0, 4);
  const recentViolations = violations.slice(0, 3);

  const applicationColumns = [
    { key: 'code', header: 'Mã hồ sơ' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (app: typeof applications[0]) => {
        const enterprise = enterprises.find(e => e.id === app.enterprise_id);
        return enterprise?.name || '-';
      },
    },
    { key: 'type', header: 'Loại', render: (app: typeof applications[0]) => (
      <span className="text-sm">{app.type}</span>
    )},
    {
      key: 'status',
      header: 'Trạng thái',
      render: (app: typeof applications[0]) => (
        <StatusBadge status={app.status} />
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Dashboard"
        description="Tổng quan hệ thống quản lý giấy phép viễn thông"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Giấy phép hoạt động"
            value={dashboardStats.totalActiveLicenses}
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Dải số đã cấp"
            value={dashboardStats.totalNumberRanges}
            icon={Database}
            variant="success"
          />
          <StatsCard
            title="Hồ sơ chờ xử lý"
            value={dashboardStats.pendingApplications}
            icon={ClipboardList}
            variant="warning"
          />
          <StatsCard
            title="Vi phạm mới"
            value={dashboardStats.newViolations}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Licenses per Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Giấy phép cấp theo tháng
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={licensesPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Share */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Thị phần kho số theo nhà mạng
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Hồ sơ gần đây
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/applications" className="flex items-center gap-1">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable data={recentApplications} columns={applicationColumns} />
            </CardContent>
          </Card>

          {/* Recent Violations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Vi phạm gần đây
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/violations" className="flex items-center gap-1">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentViolations.map(violation => {
                  const enterprise = enterprises.find(
                    e => e.id === violation.enterprise_id
                  );
                  return (
                    <div
                      key={violation.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{violation.violation_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {enterprise?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(violation.detection_date).toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={violation.severity} />
                        <StatusBadge status={violation.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
