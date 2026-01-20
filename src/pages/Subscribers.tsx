import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Phone, User, Calendar, Building2, Signal, Loader2 } from 'lucide-react';
import { useSubscribers } from '@/hooks/useData';
import { useNumberRanges } from '@/hooks/useData';
import { Subscriber } from '@/types';

export default function Subscribers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Subscriber | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: subscribers = [], isLoading } = useSubscribers();
  const { data: numberRanges = [] } = useNumberRanges();

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Search in loaded subscribers
    const found = subscribers.find(
      sub =>
        sub.msisdn?.includes(searchTerm) ||
        sub.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResult(found || null);
    setIsSearching(false);
  };

  const getRangeName = (rangeId: string) => {
    const range = numberRanges.find(r => r.id === rangeId);
    return range?.prefix || '-';
  };

  // Get sample data from database
  const sampleSubscribers = subscribers.slice(0, 3);

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Tra cứu Thuê bao"
        description="Tìm kiếm thông tin thuê bao theo số điện thoại hoặc serial SIM"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Search Box */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tìm kiếm thuê bao</CardTitle>
            <CardDescription>
              Nhập số điện thoại (MSISDN) hoặc số serial SIM để tra cứu thông tin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ví dụ: 020912345678 hoặc SN-UNI-001"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || isLoading}>
                {isSearching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Tra cứu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Result */}
        {hasSearched && (
          <Card className="animate-fade-in">
            {searchResult ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {searchResult.msisdn}
                      </CardTitle>
                      <CardDescription>
                        Serial: {searchResult.serial_number}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={searchResult.activation_status === 'ACTIVATED' ? 'ACTIVE' : 'PENDING'} />
                      <StatusBadge status={searchResult.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">
                        Thông tin thuê bao
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Nhà mạng
                            </p>
                            <p className="font-medium">
                              {searchResult.telco?.name || '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Signal className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Dải số
                            </p>
                            <p className="font-medium">
                              {getRangeName(searchResult.range_id)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Loại thuê bao
                            </p>
                            <p className="font-medium">
                              {searchResult.sub_type === 'PREPAID'
                                ? 'Trả trước'
                                : 'Trả sau'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">
                        Thông tin kích hoạt
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Ngày kích hoạt
                            </p>
                            <p className="font-medium">
                              {searchResult.activation_date
                                ? new Date(searchResult.activation_date).toLocaleDateString('vi-VN')
                                : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đồng bộ lần cuối
                            </p>
                            <p className="font-medium">
                              {searchResult.last_sync_at
                                ? new Date(searchResult.last_sync_at).toLocaleDateString('vi-VN')
                                : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">
                  Không tìm thấy thuê bao
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Không có thuê bao nào khớp với "{searchTerm}"
                </p>
              </CardContent>
            )}
          </Card>
        )}

        {/* Sample Data Hint */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dữ liệu mẫu để thử nghiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-2 md:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-[60px] rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid gap-2 text-sm md:grid-cols-3">
                {sampleSubscribers.length > 0 ? (
                  sampleSubscribers.map(sub => (
                    <div key={sub.id} className="rounded-md bg-muted p-3">
                      <p className="font-medium">{sub.telco?.name || 'N/A'}</p>
                      <p className="text-muted-foreground">{sub.msisdn}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-3">Chưa có dữ liệu thuê bao</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
