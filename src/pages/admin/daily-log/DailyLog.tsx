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
        <Card className="border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-xl overflow-hidden mb-8 bg-white">
          <CardHeader className="bg-primary/5 border-b py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">
              {editingId ? "Modify Daily Log Entry" : "Add New Log Entry (Sheet View)"}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors" onClick={handleCloseForm}>
              <X className="size-4"/>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="overflow-x-auto custom-scroll">
                <div className="min-w-max pb-4">
                  
                  {/* UNIFIED SPREADSHEET GRID */}
                  <div className="grid grid-cols-[160px_150px_150px_130px_160px_85px_85px_repeat(10,55px)_180px_90px_110px_130px_140px_130px_90px_90px_130px_130px_230px] border-b bg-gray-50/50">
                    
                    {/* ROW 1: HEADERS */}
                    <div className="contents text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Entry Date</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">First Name</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Last Name</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">DOB</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Doctor/NP</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Lab</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Lab Rep</div>
                      
                      {/* Checkbox Headers */}
                      {['New Pt', 'Enrolled', 'Primary', 'Results', 'Address', 'Ins.', '1-Time', 'Disen.', 'HIV', 'Leave'].map(h => (
                        <div key={h} className="py-3 px-1 border-r border-gray-100 flex items-center justify-center text-[9px] font-black leading-tight text-gray-400">{h}</div>
                      ))}

                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Visit Type</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Copay ($)</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Source</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Receipt #</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Marketing</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">Next Appt</div>
                      <div className="py-3 px-2 border-r border-gray-100 flex items-center justify-center text-[9px] text-gray-400">Cancel Fee</div>
                      <div className="py-3 px-2 border-r border-gray-100 flex items-center justify-center text-[9px] text-gray-400">Program</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">DH Rep</div>
                      <div className="py-3 px-4 border-r border-gray-100 flex items-center justify-center">DH Form #</div>
                      <div className="py-3 px-4 flex items-center justify-center">Actions</div>
                    </div>

                    {/* ROW 2: INPUTS */}
                    <div className="contents bg-white">
                      {/* Entry Date (Now Selectable) */}
                      <div className="p-3 border-r border-t">
                        <Controller
                          name="date"
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full h-9 justify-center text-center bg-white border-gray-200 text-xs font-semibold", !field.value && "text-gray-400")}>
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {field.value || format(new Date(), 'MM/dd/yyyy')}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy'))} initialFocus />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                      {/* First Name */}
                      <div className="p-3 border-r border-t">
                        <Input {...register("firstName")} className="h-9 text-xs" placeholder="First Name" />
                        {errors.firstName && <p className="text-[9px] text-red-500 mt-1">{errors.firstName.message}</p>}
                      </div>
                      {/* Last Name */}
                      <div className="p-3 border-r border-t">
                        <Input {...register("lastName")} className="h-9 text-xs" placeholder="Last Name" />
                        {errors.lastName && <p className="text-[9px] text-red-500 mt-1">{errors.lastName.message}</p>}
                      </div>
                      {/* DOB */}
                      <div className="p-3 border-r border-t">
                        <Controller
                          name="dob"
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full h-9 justify-start text-left bg-white border-gray-200 text-xs", !field.value && "text-gray-400")}>
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {field.value || "DOB"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : "")} initialFocus />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                      {/* Doctor/NP */}
                      <div className="p-3 border-r border-t">
                        <Input {...register("doctorNpName")} className="h-9 text-xs" placeholder="Provider" />
                      </div>
                      {/* Lab Dropdowns */}
                      <div className="p-3 border-r border-t text-center">
                        <Controller
                          name="lab"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t text-center">
                        <Controller
                          name="labRep"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Checkboxes */}
                      {[
                        'newPatient', 'enrolled', 'primaryCarePatient', 'results', 'proofOfAddress', 
                        'insuranceCheck', 'oneTimeTesting', 'disenrolled', 'hivTestNoEnroll', 'disregardLeft'
                      ].map(id => (
                        <div key={id} className="p-3 border-r border-t flex items-center justify-center">
                          <Controller
                            name={id as any}
                            control={control}
                            render={({ field }) => (
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="size-4.5" />
                            )}
                          />
                        </div>
                      ))}

                      {/* Financial / Misc */}
                      <div className="p-3 border-r border-t">
                        <Controller
                          name="cashVisit"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["One Time Test – 350", "Lab – 5", "HIV Test – 25", "IV – 125", "Treatment – 75", "Medical Records – 50", "None"].map(v => (
                                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t">
                        <Input {...register("copayAmount")} className="h-9 text-xs text-center" placeholder="0.00" />
                      </div>
                      <div className="p-3 border-r border-t text-center">
                        <Controller
                          name="copaySource"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Credit Card">Credit Card</SelectItem></SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t">
                        <Input {...register("copayReceiptNumber")} className="h-9 text-xs" placeholder="Receipt #" />
                      </div>
                      <div className="p-3 border-r border-t">
                        <Controller
                          name="marketingSource"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Source" /></SelectTrigger>
                              <SelectContent>
                                {["Google", "Zoe Doc", "Website", "Outreach", "TikTok", "Facebook", "Instagram", "Y tube", "Twitter", "Yelp", "Mail", "Radi"].map(m => (
                                   <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t">
                        <Controller
                          name="nextApptDate"
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-9 justify-start text-left bg-white border-gray-200 text-xs">
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {field.value || "Select"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : "")} initialFocus />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                      
                      <div className="p-3 border-r border-t text-center">
                        <Controller
                          name="adviseCancellationFee"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t text-center">
                        <Controller
                          name="adviseProgram"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="p-3 border-r border-t text-center">
                        <Input {...register("dhFormRep")} className="h-9 text-xs" placeholder="Rep name" />
                      </div>
                      <div className="p-3 border-r border-t text-center">
                        <Input {...register("dhFormNumber")} className="h-9 text-xs" placeholder="Form #" />
                      </div>

                      {/* Action Cell */}
                      <div className="p-3 border-t flex gap-2 justify-center bg-gray-50/10">
                         <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold h-9 px-4 shrink-0 transition-all shadow" disabled={createMutation.isPending || updateMutation.isPending}>
                          {createMutation.isPending || updateMutation.isPending ? "SAVING..." : (editingId ? "UPDATE RECORD" : "SAVE ENTRY")}
                        </Button>
                         <Button type="button" variant="outline" size="sm" className="h-9 font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 border-gray-200 px-3" onClick={handleCloseForm}>CANCEL</Button>
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
