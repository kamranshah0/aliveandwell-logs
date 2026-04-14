import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth/useAuth";
import { 
  User, Mail, Shield, BadgeCheck, MapPin, 
  Briefcase, Calendar, RefreshCcw, CheckCircle2, 
  AlertCircle, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { getMe } from "@/api/auth.api";
import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";

const Profile: React.FC = () => {
  const { user, logout, setAuth } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Correct data binding paths based on AuthProvider structure
  const profile = user?.user;
  const role = user?.role;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await getMe();
      // Update context with fresh data
      setAuth({
        user: res.data.data,
        accessToken: localStorage.getItem('accessToken') || '', // Assuming it's in localStorage or handled by axios
        permissions: res.data.data.role?.permissions || []
      });
      toast.success("Profile synced successfully");
    } catch (err) {
      toast.error("Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <MainWrapper className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <MainHeader 
        title="Account Center"
        description="Manage your professional identity and access details."
        actionContent={
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="rounded-full px-4 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <RefreshCcw className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Syncing..." : "Refresh Profile"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="rounded-full px-4 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: HERO CARD */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-b from-[#1A4655]/70 to-[#1A4655] text-white rounded-3xl">
            <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative size-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border-2 border-white/30 shadow-inner">
                   <span className="text-5xl font-semibold text-white drop-shadow-lg">
                     {profile?.name?.[0]?.toUpperCase() || "U"}
                   </span>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight drop-shadow-sm">{profile?.name || "User Name"}</h2>
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-semibold uppercase tracking-widest">
                  {role?.name || "Member"}
                </div>
              </div>
              <div className="w-full pt-4 grid grid-cols-2 gap-4 border-t border-white/10">
                 <div className="text-center">
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">Status</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                       <CheckCircle2 className="size-3 text-green-300" />
                       <span className="text-xs font-bold capitalize">{profile?.status || "Active"}</span>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">Branch</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-xs font-bold">
                       <MapPin className="size-3 text-primary-foreground" />
                       {profile?.branchName || "Main Office"}
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-xl rounded-2xl bg-white/50 backdrop-blur-sm">
             <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-primary/50 uppercase tracking-widest flex items-center gap-2">
                   <Shield className="size-3" /> System Access
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex flex-wrap gap-2 pt-2">
                   {role?.permissions?.slice(0, 6).map((perm: string) => (
                      <span key={perm} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[9px] font-bold text-gray-500 uppercase">
                         {perm.split('.').join(' ')}
                      </span>
                   ))}
                   {(role?.permissions?.length || 0) > 6 && (
                      <span className="px-2 py-1 bg-primary/5 text-primary rounded text-[9px] font-semibold">
                         +{(role?.permissions?.length || 0) - 6} MORE
                      </span>
                   )}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">Personal Profile Info</CardTitle>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Verified credentials & workstation identity</p>
              </div>
              <div className="p-2 bg-green-50 rounded-full border border-green-100">
                 <BadgeCheck className="size-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                
                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <User className="size-3.5 fill-primary/10" /> Full Identity Name
                  </div>
                  <p className="text-sm  text-gray-800">{profile?.name || "N/A"}</p>
                </div>

                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <Mail className="size-3.5 fill-primary/10" /> Professional Email
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm  text-gray-800">{profile?.email || "N/A"}</p>
                     
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <Briefcase className="size-3.5 fill-primary/10" /> Job Designation
                  </div>
                  <p className="text-sm  text-gray-800">{profile?.designation || role?.name || "Staff Professional"}</p>
                </div>

                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <MapPin className="size-3.5 fill-primary/10" /> Assigned Branch
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm  text-gray-800">{profile?.branchName || "Central Operations"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">ID: {profile?.branchId || "000-000"}</p>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <Calendar className="size-3.5 fill-primary/10" /> Member Since
                  </div>
                  <p className="text-sm  text-gray-800">{formatDate(profile?.createdAt)}</p>
                </div>

                <div className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-primary">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    <Shield className="size-3.5 fill-primary/10" /> Unique Identifer
                  </div>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground break-all">{profile?.id}</p>
                </div>

              </div>
            </CardContent>
            <div className="px-8 pb-8">
               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                        <AlertCircle className="size-5" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold text-gray-900 uppercase tracking-tighter">Security Notice</p>
                        <p className="text-[10px] text-muted-foreground font-medium">To change your email or branch, please contact system administration.</p>
                     </div>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Profile;
