import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDailyLogFields, 
  createDailyLogField, 
  updateDailyLogField, 
  deleteDailyLogField 
} from "@/api/daily-log.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Settings2, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  BarChart3,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  MouseSensor,
  TouchSensor,
  useSensor, 
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  reorderDailyLogFields 
} from "@/api/daily-log.api";

const DailyLogFieldsTab = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: fieldsRes, isLoading } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });

  const fields = fieldsRes?.data?.data || [];

  const reorderMutation = useMutation({
    mutationFn: reorderDailyLogFields,
    onMutate: async (newIds) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["dailyLogFields"] });

      // Snapshot the previous value
      const previousFields = queryClient.getQueryData(["dailyLogFields"]);

      // Optimistically update to the new value
      if (previousFields) {
        const oldFields = (previousFields as any).data.data;
        // Create a map for quick lookup
        const fieldMap = new Map(oldFields.map((f: any) => [f.id, f]));
        // Create new array based on newIds order
        const optimisticallyOrdered = newIds.map(id => fieldMap.get(id)).filter(Boolean);
        
        queryClient.setQueryData(["dailyLogFields"], {
          ...previousFields as any,
          data: {
            ...(previousFields as any).data,
            data: optimisticallyOrdered
          }
        });
      }

      return { previousFields };
    },
    onError: (err, newIds, context) => {
      // Rollback on error
      if (context?.previousFields) {
        queryClient.setQueryData(["dailyLogFields"], context.previousFields);
      }
      toast.error("Failed to save order");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure synchronization
      queryClient.invalidateQueries({ queryKey: ["dailyLogFields"] });
    },
    onSuccess: () => {
      toast.success("Order Saved");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f: any) => String(f.id) === String(active.id));
      const newIndex = fields.findIndex((f: any) => String(f.id) === String(over.id));
      
      const newOrderedFields = arrayMove(fields, oldIndex, newIndex);
      reorderMutation.mutate(newOrderedFields.map((f: any) => String(f.id)));
    }
  };

  const createMutation = useMutation({
    mutationFn: createDailyLogField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogFields"] });
      toast.success("Field Created");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      updateDailyLogField(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogFields"] });
      toast.success("Field Updated");
      setIsDialogOpen(false);
      setEditingField(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDailyLogField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogFields"] });
      toast.success("Field Deleted");
    },
  });

  const handleEdit = (field: any) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this field? This might affect existing data reports.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleReport = (field: any) => {
    updateMutation.mutate({
      id: field.id,
      payload: { ...field, showInReport: !field.showInReport }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 pb-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="flex rounded-lg bg-primary/10 size-10 items-center justify-center">
              <Settings2 className="text-primary size-6" />
            </div>
            <div>
              <h2 className="text-base text-text-high-em font-semibold">
                Daily Log Form Configuration
              </h2>
              <p className="text-sm text-text-low-em">
                Customize the fields and charts for the Daily Log form.
              </p>
            </div>
          </div>
          <Button onClick={() => { setEditingField(null); setIsDialogOpen(true); }} className="gap-2">
            <Plus className="size-4" /> Add Field
          </Button>
        </div>

        <div className="grid gap-3">
          {isLoading ? (
            <div className="h-20 bg-gray-50 animate-pulse rounded-lg" />
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={fields.map((f: any) => String(f.id))}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field: any) => (
                  <SortableFieldItem 
                    key={field.id} 
                    field={field} 
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete}
                    handleToggleReport={handleToggleReport}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <FieldDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        field={editingField}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onSubmit={(payload: any) => {
          if (editingField) {
            updateMutation.mutate({ id: editingField.id, payload });
          } else {
            createMutation.mutate(payload);
          }
        }}
      />
    </div>
  );
};

const SortableFieldItem = ({ field, handleEdit, handleDelete, handleToggleReport }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: String(field.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <Card 
        className={`border-gray-100 hover:border-primary/30 transition-colors group ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors">
              <GripVertical className="text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{field.label}</span>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                  {field.type}
                </Badge>
                {field.isRequired && (
                  <Badge className="bg-red-50 text-red-600 text-[10px] border-red-100">Required</Badge>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">{field.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ${field.showInReport ? 'text-primary bg-primary/5' : 'text-gray-400'}`}
              onClick={() => handleToggleReport(field)}
            >
              <BarChart3 className="size-4" />
              <span className="text-xs font-bold">{field.showInReport ? "Report Active" : "No Report"}</span>
            </Button>
            <div className="w-[1px] h-6 bg-gray-100 mx-2" />
            <Button variant="ghost" size="icon" onClick={() => handleEdit(field)}>
              <Settings2 className="size-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(field.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FieldDialog = ({ isOpen, onClose, field, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    label: "",
    type: "text",
    isRequired: false,
    showInReport: true,
    options: "",
    order: 0,
  });

  // Reset form when dialog opens/field changes
  useEffect(() => {
    if (isOpen) {
      if (field) {
        setFormData({
          ...field,
          options: field.options ? field.options.join(", ") : "",
          placeholder: field.placeholder || "",
        });
      } else {
        setFormData({
          name: "",
          label: "",
          type: "text",
          isRequired: false,
          showInReport: true,
          options: "",
          order: 0,
          placeholder: "",
        });
      }
    }
  }, [isOpen, field]);

  const handleLabelChange = (val: string) => {
    const generatedName = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric
      .replace(/\s+/g, ""); // Remove spaces
    
    setFormData({
      ...formData,
      label: val,
      name: field ? formData.name : generatedName // Only auto-gen if new field
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      options: formData.type === "select" ? formData.options.split(",").map((o: string) => o.trim()).filter(Boolean) : null
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{field ? "Edit Field" : "Add New Field"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Field Label (Display Name)</label>
            <Input 
              placeholder="e.g. Visit Type" 
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Placeholder Text (Help text inside box)</label>
            <Input 
              placeholder="e.g. Select the type of visit..." 
              value={formData.placeholder}
              onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
            />
          </div>

          {field && (
            <div className="space-y-1 opacity-50">
              <label className="text-[10px] font-bold uppercase text-gray-400">Technical Key (Read-only)</label>
              <p className="text-xs font-mono bg-gray-50 p-2 rounded border">{formData.name}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="select">Select/Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input 
                type="number" 
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          {formData.type === "select" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Dropdown Options (Comma separated)</label>
              <Input 
                placeholder="Option 1, Option 2, Option 3" 
                value={formData.options}
                onChange={(e) => setFormData({...formData, options: e.target.value})}
                required
              />
            </div>
          )}

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isRequired" 
                checked={formData.isRequired}
                onCheckedChange={(v) => setFormData({...formData, isRequired: v})}
              />
              <label htmlFor="isRequired" className="text-sm cursor-pointer">Required</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="showInReport" 
                checked={formData.showInReport}
                onCheckedChange={(v) => setFormData({...formData, showInReport: v})}
              />
              <label htmlFor="showInReport" className="text-sm cursor-pointer">Show in Reports</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px]">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : (field ? "Update Field" : "Save Field")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogFieldsTab;
