import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Calendar as CalendarIcon, Upload, Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyLogs, createDailyLog, updateDailyLog, deleteDailyLog, exportDailyLogsCsv } from '@/api/daily-log.api';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { useAuth } from '@/auth/useAuth';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import MainHeader from '@/components/molecules/MainHeader';
import MainWrapper from '@/components/molecules/MainWrapper';
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DailyLogType } from "./types";
import UploadDailyLogCsvModal from '@/components/modals/UploadDailyLogCsvModal';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const dailyLogSchema = z.object({
  date: z.string().min(1, "Date is required"),
  representative: z.string().min(1, "Representative is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  doctorNpName: z.string().optional().or(z.literal("")),
  lab: z.string().optional().or(z.literal("")),
  labRep: z.string().optional().or(z.literal("")),
  newPatient: z.boolean().optional(),
  enrolled: z.boolean().optional(),
  primaryCarePatient: z.boolean().optional(),
  results: z.boolean().optional(),
  proofOfAddress: z.boolean().optional(),
  insuranceCheck: z.boolean().optional(),
  oneTimeTesting: z.boolean().optional(),
  disenrolled: z.boolean().optional(),
  hivTestNoEnroll: z.boolean().optional(),
  disregardLeft: z.boolean().optional(),
  cashVisit: z.string().optional().or(z.literal("")),
  copayAmount: z.string().optional().or(z.literal("")),
  copaySource: z.string().optional().or(z.literal("")),
  copayReceiptNumber: z.string().optional().or(z.literal("")),
  marketingSource: z.string().optional().or(z.literal("")),
  nextApptDate: z.string().optional().or(z.literal("")),
  adviseCancellationFee: z.string().optional().or(z.literal("")),
  adviseProgram: z.string().optional().or(z.literal("")),
  providerPrescribed: z.string().optional().or(z.literal("")),
  providerPrescriberType: z.string().optional().or(z.literal("")),
  providerCloseNote: z.string().optional().or(z.literal("")),
  dhFormRep: z.string().optional().or(z.literal("")),
  dhFormNumber: z.string().optional().or(z.literal("")),
  dhFormElectronic: z.string().optional().or(z.literal("")),
});

type DailyLogFormData = z.infer<typeof dailyLogSchema>;

const getDefaultValues = (userName?: string) => ({
  date: format(new Date(), 'MM/dd/yyyy'),
  representative: userName || "Receptionist",
  firstName: "",
  lastName: "",
  dob: "",
  doctorNpName: "",
  lab: 'no',
  labRep: 'no',
  newPatient: false,
  enrolled: false,
  primaryCarePatient: false,
  results: false,
  proofOfAddress: false,
  insuranceCheck: false,
  oneTimeTesting: false,
  disenrolled: false,
  hivTestNoEnroll: false,
  disregardLeft: false,
  cashVisit: 'None',
  copayAmount: "",
  copaySource: 'Cash',
  marketingSource: '',
  nextApptDate: "",
  adviseCancellationFee: 'no',
  adviseProgram: 'no',
  providerPrescribed: 'no',
  providerPrescriberType: 'Prevention',
  providerCloseNote: 'no',
  dhFormRep: "",
  dhFormNumber: "",
  dhFormElectronic: 'no',
});

const DailyLog: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['daily-logs'],
    queryFn: getDailyLogs,
  });

  const logs = logsData?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: createDailyLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] });
      toast.success("Daily log entry created successfully");
      handleCloseForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create log entry");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: any }) => updateDailyLog(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] });
      toast.success("Daily log entry updated successfully");
      handleCloseForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update log entry");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDailyLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] });
      toast.success("Log entry deleted successfully");
    },
    onError: () => toast.error("Failed to delete log entry")
  });

  const formMethods = useForm<DailyLogFormData>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: getDefaultValues(user?.name)
  });

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = formMethods;

  useEffect(() => {
    if (user?.name && !editingId && !isAdding) {
      setValue('representative', user.name);
    }
  }, [user, setValue, editingId, isAdding]);

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingId(null);
    reset(getDefaultValues(user?.name));
  };

  const onEdit = (log: DailyLogType) => {
    setEditingId(log.id);
    setIsAdding(true);
    reset({
      ...log,
      date: log.date,
      representative: log.representative,
    });
  };

  const onDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: DailyLogFormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportDailyLogsCsv();
      const { csv, fileName } = res.data.data;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
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

  const columnsWithActions = [
    ...TableColumns,
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
              <DropdownMenuItem onClick={() => onEdit(log)} className="cursor-pointer">
                <Pencil className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(log.id)} className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Daily Log"
        description="Manage and track daily receptionist activities and patient check-ins."
        actionContent={
          <div className="flex gap-2 max-sm:flex-col">
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="size-5" /> Import Logs
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-5" /> Export Logs
            </Button>
            {!isAdding && (
               <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                <Plus className="size-4" /> Add New Log
              </Button>
            )}
          </div>
        }
      />

      {isAdding && (
        <Card className="border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 rounded-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              {editingId ? "Edit Log Entry" : "Create New Entry"}
              <Button variant="ghost" size="icon" onClick={handleCloseForm}><X className="size-4"/></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Patient Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">First Name <span className="text-red-500">*</span></label>
                    <Input {...register("firstName")} placeholder="Enter first name" />
                    {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Last Name <span className="text-red-500">*</span></label>
                    <Input {...register("lastName")} placeholder="Enter last name" />
                    {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-1 flex flex-col">
                    <label className="text-xs font-semibold">Date of Birth <span className="text-red-500">*</span></label>
                    <Controller
                      name="dob"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground", errors.dob && "border-red-500")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? field.value : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : "")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dob && <p className="text-[10px] text-red-500 mt-1">{errors.dob.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Doctor/NP Name</label>
                    <Input {...register("doctorNpName")} placeholder="Enter name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Lab</label>
                    <Controller
                      name="lab"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Lab Rep</label>
                    <Controller
                      name="labRep"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-muted/20 rounded-lg border border-primary/10">
                  {[
                    { id: 'newPatient', label: 'New Patient' },
                    { id: 'enrolled', label: 'Enrolled' },
                    { id: 'primaryCarePatient', label: 'Primary Care' },
                    { id: 'results', label: 'Results' },
                    { id: 'proofOfAddress', label: 'Proof of Address' },
                    { id: 'insuranceCheck', label: 'Insurance Check' },
                    { id: 'oneTimeTesting', label: 'One Time Testing' },
                    { id: 'disenrolled', label: 'Disenrolled' },
                    { id: 'hivTestNoEnroll', label: 'HIV TEST' },
                    { id: 'disregardLeft', label: 'Disregard/Left' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Controller
                        name={item.id as any}
                        control={control}
                        render={({ field }) => (
                          <Checkbox id={item.id} checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <label htmlFor={item.id} className="text-[11px] font-medium cursor-pointer">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Cash Visit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Type of Visit</label>
                    <Controller
                      name="cashVisit"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select Visit" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="One Time Test – 350">One Time Test – 350</SelectItem>
                            <SelectItem value="Lab – 5">Lab – 5</SelectItem>
                            <SelectItem value="HIV Test – 25">HIV Test – 25</SelectItem>
                            <SelectItem value="IV – 125">IV – 125</SelectItem>
                            <SelectItem value="Treatment – 75">Treatment – 75</SelectItem>
                            <SelectItem value="Medical Records – 50">Medical Records – 50</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Copay Amount</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Copay Amount ($)</label>
                    <Input {...register("copayAmount")} placeholder="0.00" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Copay Source</label>
                    <Controller
                      name="copaySource"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Copay Receipt #</label>
                    <Input {...register("copayReceiptNumber")} placeholder="Enter receipt number" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Marketing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Marketing Source</label>
                    <Controller
                      name="marketingSource"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select Marketing Source" /></SelectTrigger>
                          <SelectContent>
                            {["Google", "Zoe Doc", "Website", "Outreach", "TikTok", "Facebook", "Instagram", "Y tube", "Twitter", "Yelp", "Mail", "Radi"].map(m => (
                               <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Next Appt Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="space-y-1 flex flex-col">
                    <label className="text-xs font-semibold">Next Appt Date</label>
                    <Controller
                      name="nextApptDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? field.value : <span>Select Date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : "")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  {[
                    { id: 'adviseCancellationFee', label: 'Advise Cancellation Fee' },
                    { id: 'adviseProgram', label: 'Advise Program' },
                    { id: 'providerPrescribed', label: 'Provider Prescribed' },
                    { id: 'providerCloseNote', label: 'Provider Close Note' },
                    { id: 'dhFormElectronic', label: 'DH Form Electronic' },
                  ].map(item => (
                    <div key={item.id} className="space-y-1">
                      <label className="text-xs font-semibold">{item.label}</label>
                      <Controller
                        name={item.id as any}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Yes/No" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Provider Prescriber Type</label>
                    <Controller
                      name="providerPrescriberType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Prevention">Prevention</SelectItem>
                            <SelectItem value="Primary">Primary</SelectItem>
                            <SelectItem value="Treatment">Treatment</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">DH Form Rep</label>
                    <Input {...register("dhFormRep")} placeholder="Rep name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">DH Form #</label>
                    <Input {...register("dhFormNumber")} placeholder="Form number" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingId ? "Update Log" : "Save Log")}
                </Button>
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
