import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDashboardConfig, updateDashboardConfig } from "@/api/dashboard.api";
import { toast } from "sonner";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Settings, Save, RotateCcw } from "lucide-react";

const DashboardSettings = () => {
  const [startDate, setStartDate] = useState("");
  const [isAllHistory, setIsAllHistory] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isToday, setIsToday] = useState(false);
  const [location, setLocation] = useState("all");

  const { data: configRes, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["dashboardConfig"],
    queryFn: getDashboardConfig,
  });

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
    }
  }, [configRes]);

  const updateMutation = useMutation({
    mutationFn: updateDashboardConfig,
    onSuccess: () => {
      toast.success("Dashboard default settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update dashboard settings");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      startDate: isAllHistory ? "" : startDate,
      endDate: isToday ? "today" : endDate,
      location,
    });
  };

  const handleReset = () => {
    setStartDate("");
    setIsAllHistory(true);
    setEndDate("");
    setIsToday(false);
    setLocation("all");
  };

  if (isLoadingConfig) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <MainWrapper>
      <MainHeader
        title="Dashboard Settings"
        description="Configure default filters for the Admin Dashboard. These settings apply to all users."
      />

      <div className="max-w-3xl mx-auto mt-8">
        <Card className="border-primary/10 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary p-6">
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="size-5" />
              Global Default Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {updateMutation.isPending ? "Saving..." : "Save Global Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainWrapper>
  );
};

export default DashboardSettings;
