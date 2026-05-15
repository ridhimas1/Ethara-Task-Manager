'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Paperclip, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import MagneticButton from '@/components/ui/MagneticButton';

const COLUMN_ORDER = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
const COLUMN_TITLES: any = {
  'TODO': 'Todo',
  'IN_PROGRESS': 'In Progress',
  'REVIEW': 'Review',
  'COMPLETED': 'Completed'
};

export default function KanbanPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, updateTaskStatus, isLoading } = useDataStore();
  
  // Local state for immediate DnD responsiveness before store syncs
  const [localTasks, setLocalTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-ethara-neon text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]';
      case 'HIGH': return 'bg-ethara-primary text-white';
      case 'MEDIUM': return 'bg-ethara-accent text-white';
      case 'LOW': return 'bg-ethara-muted text-ethara-surface';
      default: return 'bg-ethara-muted text-white';
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Update local immediately for smooth UI
    const updatedTasks = localTasks.map(t => 
      t.id === draggableId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updatedTasks);

    // Update in store (which calls API)
    updateTaskStatus(draggableId, newStatus);
  };

  const getTasksByStatus = (status: string) => {
    return localTasks.filter(t => t.status === status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-1">Task Management</h2>
            <p className="text-ethara-muted text-sm">Drag and drop to update workflow status.</p>
          </div>
          {user?.role === 'ADMIN' && (
            <MagneticButton className="bg-gradient-to-r from-ethara-deep to-ethara-primary hover:from-ethara-primary hover:to-ethara-neon text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-2">
              <Plus size={18} /> New Task
            </MagneticButton>
          )}
        </div>

        {isLoading && localTasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-ethara-neon animate-pulse font-heading">
            LOADING TASKS...
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full min-w-max items-start">
                {COLUMN_ORDER.map((status) => {
                  const columnTasks = getTasksByStatus(status);

                  return (
                    <div key={status} className="w-[320px] flex flex-col max-h-full">
                      {/* Column Header */}
                      <div className="glass-card rounded-xl p-4 mb-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white tracking-wide uppercase text-sm">{COLUMN_TITLES[status]}</h3>
                          <span className="bg-ethara-bg text-ethara-muted text-xs font-bold px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                        </div>
                        <button className="text-ethara-muted hover:text-white"><MoreHorizontal size={18}/></button>
                      </div>

                      {/* Droppable Area */}
                      <Droppable droppableId={status}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 overflow-y-auto custom-scrollbar space-y-4 p-2 rounded-xl transition-colors min-h-[200px] ${snapshot.isDraggingOver ? 'bg-ethara-surface/30' : ''}`}
                          >
                            {columnTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`glass-card p-4 rounded-xl border border-ethara-border/30 hover:border-ethara-primary/50 transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-[0_10px_30px_rgba(239,68,68,0.2)]' : ''}`}
                                    style={{...provided.draggableProps.style}}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority || 'MEDIUM')}`}>
                                        {task.priority || 'MEDIUM'}
                                      </span>
                                      <button className="text-ethara-muted hover:text-white"><MoreHorizontal size={16}/></button>
                                    </div>
                                    
                                    <h4 className="text-white font-bold text-sm mb-1">{task.title}</h4>
                                    <p className="text-xs text-ethara-muted line-clamp-2 mb-3">{task.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="text-[10px] font-bold text-ethara-muted bg-ethara-bg px-2 py-1 rounded border border-ethara-border/20 truncate max-w-[120px]">
                                        {task.project?.title || 'No Project'}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-ethara-border/20">
                                      <div className="flex items-center gap-3 text-xs text-ethara-muted">
                                        <span className={`flex items-center gap-1`}>
                                          <Clock size={12}/> 
                                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                        </span>
                                      </div>
                                      <div className="w-6 h-6 rounded-full bg-ethara-surface flex items-center justify-center text-[10px] font-bold text-white border border-ethara-border/50 overflow-hidden">
                                        {task.assignee?.avatar ? (
                                          <img src={task.assignee.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                          task.assignee?.name?.substring(0, 2).toUpperCase() || 'U'
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
