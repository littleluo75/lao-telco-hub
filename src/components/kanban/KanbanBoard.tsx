import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, MoreHorizontal, GripVertical, Building2, Calendar, FileText } from 'lucide-react';
import { Application, ApplicationStatus, Enterprise } from '@/types';
import { cn } from '@/lib/utils';

interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const columns: KanbanColumn[] = [
  {
    id: 'DRAFT',
    title: 'Nháp',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  {
    id: 'SUBMITTED',
    title: 'Đã nộp',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'REVIEWING',
    title: 'Đang xem xét',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'APPROVED',
    title: 'Đã duyệt',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'REJECTED',
    title: 'Từ chối',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
];

const typeLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  NEW: { label: 'Cấp mới', variant: 'default' },
  RENEW: { label: 'Gia hạn', variant: 'secondary' },
  ADJUST: { label: 'Điều chỉnh', variant: 'outline' },
  REVOKE: { label: 'Thu hồi', variant: 'outline' },
};

interface KanbanBoardProps {
  applications: Application[];
  enterprises: Enterprise[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onView?: (application: Application) => void;
  onEdit?: (application: Application) => void;
}

export function KanbanBoard({
  applications,
  enterprises,
  onStatusChange,
  onView,
  onEdit,
}: KanbanBoardProps) {
  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const getEnterpriseName = (enterpriseId: string) => {
    return enterprises.find((e) => e.id === enterpriseId)?.name || 'N/A';
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as ApplicationStatus;

    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnApps = getApplicationsByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className={cn(
                'flex min-w-[300px] flex-col rounded-xl border-2',
                column.borderColor,
                column.bgColor
              )}
            >
              {/* Column Header */}
              <div className={cn('flex items-center justify-between p-4 border-b', column.borderColor)}>
                <div className="flex items-center gap-2">
                  <h3 className={cn('font-semibold', column.color)}>{column.title}</h3>
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {columnApps.length}
                  </Badge>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex-1 space-y-3 p-3 min-h-[400px] transition-colors',
                      snapshot.isDraggingOver && 'bg-primary/5'
                    )}
                  >
                    {columnApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              'bg-card shadow-sm transition-all duration-200 hover:shadow-md',
                              snapshot.isDragging && 'shadow-lg ring-2 ring-primary/20 rotate-2'
                            )}
                          >
                            <CardContent className="p-4">
                              {/* Card Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab text-muted-foreground hover:text-foreground"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <span className="font-mono text-sm font-medium text-primary">
                                    {app.code}
                                  </span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onView?.(app)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Xem chi tiết
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit?.(app)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Enterprise */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Building2 className="h-3.5 w-3.5" />
                                <span className="truncate">{getEnterpriseName(app.enterprise_id)}</span>
                              </div>

                              {/* Type Badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                <Badge variant={typeLabels[app.type]?.variant || 'outline'}>
                                  {typeLabels[app.type]?.label || app.type}
                                </Badge>
                              </div>

                              {/* Submission Date */}
                              {app.submission_date && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    Nộp: {new Date(app.submission_date).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              )}

                              {/* Created By */}
                              {app.created_by && (
                                <div className="mt-2 pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">
                                    Tạo bởi: {app.created_by}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnApps.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                        Kéo thả hồ sơ vào đây
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
