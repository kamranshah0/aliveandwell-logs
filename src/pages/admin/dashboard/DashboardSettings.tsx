import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboardConfig, updateDashboardConfig } from "@/api/dashboard.api";
import { getBranches } from "@/api/branch.api";
import { getDailyLogFields } from "@/api/daily-log.api";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Settings, Save, RotateCcw, LayoutDashboard, Stethoscope, Briefcase } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const dashboardCards = [
  { key: "entriesThisMonth", label: "Entries This Month" },
  { key: "totalEntries", label: "Total Entries" },
  { key: "newPatients", label: "New Patients" },
  { key: "existingPatients", label: "Existing Patients" },
  { key: "refillPrescriptions", label: "Refills Prescription" },
  { key: "newPrescriptions", label: "NEW Prescription" },
  { key: "assistantProgram", label: "Assistant Program" },
];

const defaultVisibleCards = dashboardCards.reduce<Record<string, boolean>>((acc, card) => {
  acc[card.key] = true;
  return acc;
}, {});

const DashboardSettings = () => {
  const queryClient = useQueryClient();
  const [settingsMode, setSettingsMode] = useState<"branch" | "role">("branch");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [isAllHistory, setIsAllHistory] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isToday, setIsToday] = useState(false);
  const [location, setLocation] = useState("all");
  const [showLast24Hours, setShowLast24Hours] = useState(false);
  const [visitServices, setVisitServices] = useState<string[]>([]);
  const [visitTypes, setVisitTypes] = useState<string[]>([]);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>(defaultVisibleCards);

  const { data: fieldsRes } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });

  const { data: branchesRes, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const branches = branchesRes?.data?.data || [];
  const activeTarget = settingsMode === "branch"
    ? { branchId: selectedBranchId || null, roleId: null }
    : { branchId: null, roleId: selectedRoleId || null };
  const activeTargetId = activeTarget.branchId || activeTarget.roleId;

  const availableVisitServices = fieldsRes?.data?.data?.find((f: any) => f.name === "visitServices")?.options || [];
  const availableVisitTypes = fieldsRes?.data?.data?.find((f: any) => f.name === "visitType")?.options || [];

  const { data: configRes, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["dashboardConfig", settingsMode, activeTargetId],
    queryFn: () => getDashboardConfig(activeTarget),
    enabled: Boolean(activeTargetId),
  });

  useEffect(() => {
    if (settingsMode === "branch" && !selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId, settingsMode]);

  useEffect(() => {
    if (settingsMode === "role" && !selectedRoleId && roles.length > 0) {
      setSelectedRoleId(roles[0].value);
    }
  }, [roles, selectedRoleId, settingsMode]);

  useEffect(() => {
    if (configRes?.data) {
      if (!configRes.data.startDate || configRes.data.startDate === "") {
        setIsAllHistory(true);
        setStartDate("");
      } else {
        setIsAllHistory(false);
        setStartDate(configRes.data.startDate);
      }

      if (configRes.data.endDate === "today") {
        setIsToday(true);
        setEndDate("");
      } else {
        setIsToday(false);
        setEndDate(configRes.data.endDate || "");
      }
      setLocation(configRes.data.location || "all");
      setShowLast24Hours(configRes.data.showLast24Hours || false);
      setVisitServices(configRes.data.visitServices || []);
      setVisitTypes(configRes.data.visitTypes || []);
      setVisibleCards({
        ...defaultVisibleCards,
        ...(configRes.data.visibleCards || {}),
      });
    }
  }, [configRes]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateDashboardConfig(payload, activeTarget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardConfig", settingsMode, activeTargetId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardConfig"] });
      toast.success("Dashboard settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update dashboard settings");
    },
  });

  const handleSave = () => {
    if (!activeTargetId) {
      toast.error(`Please select a ${settingsMode} first`);
      return;
    }

    updateMutation.mutate({
      startDate: isAllHistory ? "" : startDate,
      endDate: isToday ? "today" : endDate,
      branchId: activeTarget.branchId,
      roleId: activeTarget.roleId,
      location,
      showLast24Hours,
      visitServices,
      visitTypes,
      visibleCards,
    });
  };

  const handleReset = () => {
    setStartDate("");
    setIsAllHistory(true);
    setEndDate("");
    setIsToday(false);
    setLocation("all");
    setShowLast24Hours(false);
    setVisitServices([]);
    setVisitTypes([]);
    setVisibleCards(defaultVisibleCards);
  };

  const toggleCardVisibility = (key: string, checked: boolean) => {
    setVisibleCards((current) => ({
      ...current,
      [key]: checked,
    }));
  };

  if (isLoadingBranches || isLoadingRoles || (activeTargetId && isLoadingConfig)) return <div className="p-8 text-center">Loading settings...</div>;

  if (settingsMode === "branch" && !activeTargetId && branches.length === 0) {
    return <div className="p-8 text-center">No branches found.</div>;
  }

  if (settingsMode === "role" && !activeTargetId && roles.length === 0) {
    return <div className="p-8 text-center">No roles found.</div>;
  }

  return (
    <MainWrapper>
      <MainHeader
        title="Dashboard Settings"
        description="Configure logs dashboard filters separately for branches and branch-less roles."
      />

      <div className="max-w-3xl mx-auto mt-8">
        <Card className="border-primary/10 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary p-6">
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="size-5" />
              Logs Dashboard Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Settings Type</label>
              <Select value={settingsMode} onValueChange={(value) => setSettingsMode(value as "branch" | "role")}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select settings type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branch">Branch Settings</SelectItem>
                  <SelectItem value="role">Role Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Settings For
              </label>
              {settingsMode === "branch" ? (
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: any) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-[10px] text-gray-400 italic">
                Branch settings apply to users with that branch. Role settings apply to users who do not have a branch assigned.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="size-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Dashboard Cards</h3>
                  <p className="text-[10px] text-gray-400">Enable a card to show it on the Admin Dashboard.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dashboardCards.map((card) => (
                  <div
                    key={card.key}
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-4 py-3"
                  >
                    <label htmlFor={`card-${card.key}`} className="text-sm font-medium text-gray-700">
                      {card.label}
                    </label>
                    <Switch
                      id={`card-${card.key}`}
                      checked={visibleCards[card.key]}
                      onCheckedChange={(checked) => toggleCardVisibility(card.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Visit Services Cards</h3>
                  <p className="text-[10px] text-gray-400">Select which services should appear as cards on the dashboard.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableVisitServices.map((service: string) => (
                  <div key={service} className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-4 py-3">
                    <label className="text-sm font-medium text-gray-700">{service}</label>
                    <Switch
                      checked={visitServices.includes(service)}
                      onCheckedChange={(checked) => {
                        setVisitServices(prev => checked ? [...prev, service] : prev.filter(s => s !== service));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="size-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Visit Type Cards</h3>
                  <p className="text-[10px] text-gray-400">Select which visit types should appear as cards on the dashboard.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableVisitTypes.map((type: string) => (
                  <div key={type} className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-4 py-3">
                    <label className="text-sm font-medium text-gray-700">{type}</label>
                    <Switch
                      checked={visitTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        setVisitTypes(prev => checked ? [...prev, type] : prev.filter(t => t !== type));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Default Start Date</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="all-history-check" 
                      checked={isAllHistory} 
                      onChange={(e) => setIsAllHistory(e.target.checked)} 
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="all-history-check" className="text-[10px] font-bold text-primary uppercase">Beginning</label>
                  </div>
                </div>
                <Input
                  type="date"
                  value={startDate}
                  disabled={isAllHistory}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Default End Date</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="today-check" 
                      checked={isToday} 
                      onChange={(e) => setIsToday(e.target.checked)} 
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="today-check" className="text-[10px] font-bold text-primary uppercase">Always Today</label>
                  </div>
                </div>
                <Input
                  type="date"
                  value={endDate}
                  disabled={isToday}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="size-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Last 24 Hours View</h3>
                    <p className="text-[10px] text-gray-400">Only show records from the last 24 hours (EST).</p>
                  </div>
                </div>
                <Switch
                  checked={showLast24Hours}
                  onCheckedChange={setShowLast24Hours}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Default Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select Default Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="HMO">HMO</SelectItem>
                  <SelectItem value="NMO">NMO</SelectItem>
                  <SelectItem value="LMO">LMO</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-gray-400 italic">This location will be selected by default for all users.</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-500"
              >
                <RotateCcw className="size-4" />
                Reset Local
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-8"
              >
                <Save className="size-4" />
                {updateMutation.isPending ? "Saving..." : `Save ${settingsMode === "branch" ? "Branch" : "Role"} Settings`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainWrapper>
  );
};

export default DashboardSettings;
