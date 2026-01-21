import { AppHeader } from '@/components/layout/AppHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable } from '@/components/common/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
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
  useDashboardStats, 
  useViolations, 
  useApplications, 
  useEnterprises, 
  useNumberRanges 
} from '@/hooks/useData';
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
import { Application, ComplianceViolation } from '@/types';

// Static chart data (would come from aggregated queries in production)
const licensesPerMonth = [
  { name: 'T1', value: 4 },
  { name: 'T2', value: 3 },
  { name: 'T3', value: 5 },
  { name: 'T4', value: 2 },
  { name: 'T5', value: 6 },
  { name: 'T6', value: 4 },
  { name: 'T7', value: 7 },
  { name: 'T8', value: 5 },
  { name: 'T9', value: 3 },
  { name: 'T10', value: 4 },
  { name: 'T11', value: 6 },
  { name: 'T12', value: 8 },
];

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: applications = [], isLoading: isLoadingApps } = useApplications();
  const { data: violations = [], isLoading: isLoadingViolations } = useViolations();
  const { data: enterprises = [] } = useEnterprises();
  const { data: numberRanges = [] } = useNumberRanges();

  const recentApplications = applications.slice(0, 4);
  const recentViolations = violations.slice(0, 3);

  // Calculate market share from number ranges
  const marketShareData = enterprises
    .filter(e => numberRanges.some(nr => nr.telco_id === e.id))
    .map((enterprise, index) => {
      const telcoRanges = numberRanges.filter(nr => nr.telco_id === enterprise.id);
      const totalBlocks = telcoRanges.reduce((sum, nr) => sum + (nr.block_size || 0), 0);
      const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
      return {
        name: enterprise.name.split(' ')[0],
        value: totalBlocks,
        color: colors[index % colors.length],
      };
    })
    .filter(item => item.value > 0);

  // Calculate percentages for market share
  const totalMarketShare = marketShareData.reduce((sum, item) => sum + item.value, 0);
  const marketSharePercent = marketShareData.map(item => ({
    ...item,
    value: totalMarketShare > 0 ? Math.round((item.value / totalMarketShare) * 100) : 0,
  }));

  const applicationColumns = [
    { key: 'code', header: 'Mã hồ sơ' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (app: Application) => app.enterprise?.name || '-',
    },
    { 
      key: 'type', 
      header: 'Loại', 
      render: (app: Application) => {
        const typeLabels: Record<string, string> = {
          NEW: 'Cấp mới',
          RENEW: 'Gia hạn',
          ADJUST: 'Điều chỉnh',
          REVOKE: 'Thu hồi',
        };
        return <span className="text-sm">{typeLabels[app.type] || app.type}</span>;
      }
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (app: Application) => <StatusBadge status={app.status} />,
    },
  ];

  const isLoading = isLoadingStats || isLoadingApps || isLoadingViolations;

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Dashboard"
        description="Tổng quan hệ thống quản lý giấy phép viễn thông"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoadingStats ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[120px] rounded-lg" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Giấy phép hoạt động"
                value={stats?.totalActiveLicenses || 0}
                icon={FileText}
                variant="primary"
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Dải số đã cấp"
                value={stats?.totalNumberRanges || 0}
                icon={Database}
                variant="success"
              />
              <StatsCard
                title="Hồ sơ chờ xử lý"
                value={stats?.pendingApplications || 0}
                icon={ClipboardList}
                variant="warning"
              />
              <StatsCard
                title="Vi phạm mới"
                value={stats?.newViolations || 0}
                icon={AlertTriangle}
                variant="danger"
              />
            </>
          )}
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
                      data={marketSharePercent}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {marketSharePercent.map((entry, index) => (
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
              {isLoadingApps ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <DataTable data={recentApplications} columns={applicationColumns} />
              )}
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
              {isLoadingViolations ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentViolations.map((violation: ComplianceViolation) => (
                    <div
                      key={violation.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{violation.violation_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {violation.enterprise?.name || '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(violation.detection_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={violation.severity} />
                        <StatusBadge status={violation.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
