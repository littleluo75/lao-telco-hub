import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UploadData() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; status: 'success' | 'error' | 'pending'; message?: string }[]
  >([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      name: file.name,
      status: 'pending' as const,
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate processing
    files.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev =>
          prev.map((f, i) => {
            if (i === prev.length - files.length + index) {
              const isValid = file.name.endsWith('.csv') || file.name.endsWith('.xlsx');
              return {
                ...f,
                status: isValid ? 'success' : 'error',
                message: isValid
                  ? 'Đã xử lý thành công'
                  : 'Định dạng file không hợp lệ',
              };
            }
            return f;
          })
        );

        if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
          toast({
            title: 'Upload thành công',
            description: `File ${file.name} đã được xử lý.`,
          });
        } else {
          toast({
            title: 'Lỗi upload',
            description: `File ${file.name} không hợp lệ.`,
            variant: 'destructive',
          });
        }
      }, 1000 + index * 500);
    });
  };

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Upload dữ liệu"
        description="Tải lên dữ liệu sử dụng từ các nhà mạng để đối chiếu tuân thủ"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Tải lên file dữ liệu</CardTitle>
            <CardDescription>
              Hỗ trợ định dạng CSV, XLSX. Dữ liệu sẽ được đối chiếu với kho số đã
              cấp phép.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              )}
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Kéo thả file vào đây
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                hoặc click để chọn file
              </p>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="absolute h-full w-full cursor-pointer opacity-0"
                style={{ position: 'relative' }}
              />
              <Button className="mt-4" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Chọn file
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>File đã tải lên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.message || 'Đang xử lý...'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {file.status === 'pending' && (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hướng dẫn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Định dạng file CSV/XLSX:</h4>
                <ul className="mt-2 list-inside list-disc text-muted-foreground">
                  <li>Cột MSISDN: Số điện thoại thuê bao</li>
                  <li>Cột Usage_Date: Ngày sử dụng (DD/MM/YYYY)</li>
                  <li>Cột Data_Volume: Dung lượng sử dụng (MB)</li>
                  <li>Cột Call_Duration: Thời lượng cuộc gọi (phút)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Quy trình xử lý:</h4>
                <ol className="mt-2 list-inside list-decimal text-muted-foreground">
                  <li>Upload file dữ liệu từ nhà mạng</li>
                  <li>Hệ thống kiểm tra định dạng và validate dữ liệu</li>
                  <li>Đối chiếu với kho số đã cấp phép</li>
                  <li>Phát hiện và ghi nhận vi phạm (nếu có)</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
