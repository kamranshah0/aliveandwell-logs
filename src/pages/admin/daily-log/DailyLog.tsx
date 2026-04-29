import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  Upload,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
  exportDailyLogsCsv,
  getDailyLogFields,
} from "@/api/daily-log.api";
import { generateColumns } from "./columns";
import { toast } from "sonner";
import { format, parse } from "date-fns";
import { useAuth } from "@/auth/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DailyLogType } from "./types";
import UploadDailyLogCsvModal from "@/components/modals/UploadDailyLogCsvModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const baseDailyLogSchema = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be MM/DD/YYYY"),
  representative: z.string().min(1, "Representative is required"),
  location: z.string().optional().or(z.literal("")),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "DOB must be MM/DD/YYYY"),
});

const DailyLog: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: fieldsRes, isLoading: isLoadingFields, refetch: refetchFields } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });

  const fields = fieldsRes?.data?.data || [];

  const handleDownloadSample = async () => {
    // Explicitly refetch to get latest fields before generating CSV
    const { data: latestFieldsRes } = await refetchFields();
    const latestFields = latestFieldsRes?.data?.data || fields;

    if (!latestFields || latestFields.length === 0) {
      toast.error("No fields configured yet");
      return;
    }
    
    const headers = latestFields.map((f: any) => `"${f.label.replace(/"/g, '""')}"`);
    const sampleRow = latestFields.map((f: any) => {
      let val = "Sample Data";
      if (f.type === "date") val = format(new Date(), "MM/dd/yyyy");
      if (f.type === "checkbox") val = "no";
      if (f.type === "select") val = f.options?.[0] || "None";
      if (f.type === "number") val = "0";
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    
    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_log_template_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Generate Dynamic Schema
  const dynamicSchema = React.useMemo(() => {
    let schema = baseDailyLogSchema;
    fields.forEach((field: any) => {
      let fieldSchema: any;
      if (field.type === "checkbox") {
        fieldSchema = z.boolean().optional();
      } else if (field.type === "date") {
        fieldSchema = z.string().optional().or(z.literal("")).refine((val?: string | null) => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
          message: "Must be MM/DD/YYYY",
        });
      } else {
        fieldSchema = z.string().optional().or(z.literal(""));
      }

      if (field.isRequired) {
        // Simple required check for demo, can be more complex
        fieldSchema = fieldSchema.refine((val: any) => !!val, { message: `${field.label} is required` });
      }

      schema = schema.extend({ [field.name]: fieldSchema });
    });
    return schema;
  }, [fields]);

  const defaultValues = React.useMemo(() => {
    const userName = user?.user?.name || user?.name || "Receptionist";
    const branchName = user?.user?.branchName || user?.branchName || "";

    const vals: any = {};
    fields.forEach((field: any) => {
      if (field.name === "date") vals.date = format(new Date(), "MM/dd/yyyy");
      else if (field.name === "representative") vals.representative = userName;
      else if (field.name === "location") vals.location = branchName;
      else {
        vals[field.name] = field.type === "checkbox" ? false : (field.type === "select" && field.options?.[0]) || "";
      }
    });
    return vals;
  }, [fields, user]);

  const gridTemplateColumns = React.useMemo(() => {
    const dynamic = fields.map((f: any) => {
      if (f.type === "checkbox") return "minmax(100px, 1fr)";
      if (f.type === "select") return "minmax(180px, 1fr)";
      if (f.type === "number") return "minmax(100px, 1fr)";
      if (f.name === "date") return "160px";
      if (f.name === "location") return "200px";
      if (f.name === "representative") return "200px";
      return "minmax(150px, 1fr)";
    }).join(" ");
    return `${dynamic} 180px`;
  }, [fields]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  // Re-initialize form when fields or default values change
  useEffect(() => {
    if (fields.length > 0) {
      reset(defaultValues);
    }
  }, [fields, defaultValues, reset]);


  const { data: logsData, isLoading } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: getDailyLogs,
  });

  const logs = logsData?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: createDailyLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
      queryClient.invalidateQueries({ queryKey: ["adminDailyLogReports"] });
      toast.success("Daily log entry created successfully");
      handleCloseForm();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create log entry",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      updateDailyLog(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
      queryClient.invalidateQueries({ queryKey: ["adminDailyLogReports"] });
      toast.success("Daily log entry updated successfully");
      handleCloseForm();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update log entry",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDailyLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
      queryClient.invalidateQueries({ queryKey: ["adminDailyLogReports"] });
      toast.success("Log entry deleted successfully");
    },
    onError: () => toast.error("Failed to delete log entry"),
  });

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingId(null);
    reset(defaultValues);
  };

  const onEdit = (log: any) => {
    setEditingId(log.id);
    setIsAdding(true);
    // Merge additionalData back into the flat object for the form
    reset({
      ...log,
      ...log.additionalData,
    });
  };

  const onDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: any) => {
    // Separate core fields from dynamic fields
    const coreFields = ["date", "representative", "location", "firstName", "lastName", "dob"];
    const payload: any = {};
    const additionalData: any = {};

    Object.keys(data).forEach((key) => {
      if (coreFields.includes(key)) {
        payload[key] = data[key];
      } else {
        additionalData[key] = data[key];
      }
    });

    payload.additionalData = additionalData;

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(`Validation Error: ${firstError.message}`);
    } else {
      toast.error("Please check all required fields.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportDailyLogsCsv();
      const { csv, fileName } = res.data.data;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Log exported successfully");
    } catch (err) {
      toast.error("Failed to export logs");
    }
  };

  const columnsWithActions = React.useMemo(() => [
    ...generateColumns(fields),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const log = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(log)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(log.id)}
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="mr-2 size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [fields]);

  return (
    <MainWrapper className="flex flex-col gap-8 overflow-hidden max-w-full min-w-0">
      <MainHeader
        title="Daily Log"
        description="Manage and track daily receptionist activities and patient check-ins."
        actionContent={
          <div className="flex gap-2 max-sm:flex-col">
            <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/5"
              onClick={handleDownloadSample}
            >
              <Download className="size-4 mr-2" /> Sample CSV
            </Button>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="size-5" /> Import Logs
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-5" /> Export Logs
            </Button>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="size-4" /> Add New Log
              </Button>
            )}
          </div>
        }
      />

      {isAdding && (
        <Card className="w-full min-w-0 border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-xl overflow-hidden mb-8 bg-white">
          <CardHeader className="bg-primary/5 border-b py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">
              {editingId
                ? "Modify Daily Log Entry"
                : "Add New Log Entry (Sheet View)"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
              onClick={handleCloseForm}
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <div className="w-full min-w-0 overflow-x-auto custom-scroll">
                <div className="min-w-max pb-4">
                  {/* UNIFIED SPREADSHEET GRID (DYNAMIC) */}
                  <div 
                    className="grid border-l border-t border-gray-200"
                    style={{
                      gridTemplateColumns
                    }}
                  >
                    {/* ROW 1: HEADERS */}
                    <div className="contents text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center">
                      {fields.map((field: any) => (
                        <div key={field.id} className="py-4 px-4 bg-gray-50 border-r border-b border-gray-200 flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis">
                          {field.label}
                        </div>
                      ))}
                      <div className="py-4 px-4 bg-gray-50 border-r border-b border-gray-200 flex items-center justify-center text-gray-400">
                        Actions
                      </div>
                    </div>


                    {/* ROW 2: INPUTS */}
                    <div className="contents bg-white">
                      {/* Dynamic Fields Loop */}
                      {fields.map((field: any) => (
                        <div key={field.id} className="p-3 bg-white border-r border-b border-gray-200 flex flex-col justify-center min-h-[64px]">
                          {field.name === "date" || field.type === "date" ? (
                            <Controller
                              name={field.name}
                              control={control}
                              render={({ field: dateField }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full h-9 text-xs justify-start text-left font-normal",
                                        !dateField.value && "text-muted-foreground",
                                        (field.name === "date" || field.name === "location" || field.name === "representative") && "bg-gray-50 cursor-not-allowed"
                                      )}
                                      disabled={field.name === "date" || field.name === "location" || field.name === "representative"}
                                    >
                                      <CalendarIcon className="mr-2 h-3 w-3" />
                                      {dateField.value ? dateField.value : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={dateField.value ? parse(dateField.value, "MM/dd/yyyy", new Date()) : undefined}
                                      onSelect={(date) => dateField.onChange(date ? format(date, "MM/dd/yyyy") : "")}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                          ) : field.type === "select" ? (
                            <Controller
                              name={field.name}
                              control={control}
                              render={({ field: selectField }) => (
                                <Select
                                  onValueChange={selectField.onChange}
                                  value={selectField.value}
                                >
                                  <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder={field.placeholder || field.label} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((opt: string) => (
                                      <SelectItem key={opt} value={opt} className="text-xs">
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          ) : field.type === "checkbox" ? (
                            <div className="flex items-center justify-center h-full">
                              <Controller
                                name={field.name}
                                control={control}
                                render={({ field: checkField }) => (
                                  <Checkbox
                                    checked={checkField.value}
                                    onCheckedChange={checkField.onChange}
                                    className="size-5"
                                  />
                                )}
                              />
                            </div>
                          ) : (
                            <Input
                              {...register(field.name)}
                              type={field.type === "number" ? "number" : "text"}
                              className={cn(
                                "h-9 text-xs",
                                (field.name === "location" || field.name === "representative") && "bg-gray-50 font-bold cursor-not-allowed"
                              )}
                              placeholder={field.placeholder || field.label}
                              disabled={field.name === "location" || field.name === "representative"}
                              readOnly={field.name === "location" || field.name === "representative"}
                            />
                          )}
                          {errors[field.name] && (
                            <p className="text-[10px] text-red-500 font-medium mt-1.5 px-1">
                              {(errors[field.name] as any).message}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Action Cell */}
                      <div className="p-3 bg-gray-50/30 border-r border-b border-gray-200 flex gap-2 justify-center items-center">
                        <Button
                          type="submit"
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 shrink-0 transition-all shadow-md active:scale-95"
                          disabled={
                            createMutation.isPending || updateMutation.isPending
                          }
                        >
                          {createMutation.isPending || updateMutation.isPending
                            ? "SAVING..."
                            : editingId
                              ? "UPDATE RECORD"
                              : "SAVE ENTRY"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="h-11 font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 border-gray-200 px-6 active:scale-95"
                          onClick={handleCloseForm}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <DataTable<DailyLogType>
        columns={columnsWithActions}
        data={logs}
        filters={DataFilters}
        isLoading={isLoading}
      />

      <UploadDailyLogCsvModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </MainWrapper>
  );
};

export default DailyLog;
