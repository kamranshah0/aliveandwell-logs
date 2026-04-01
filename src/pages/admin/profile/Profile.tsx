import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth/useAuth";
import { User, Mail, Shield, BadgeCheck } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
        <p className="text-muted-foreground">View your account information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/10 shadow-sm rounded-xl">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="size-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || "User Name"}</h2>
              <p className="text-sm text-muted-foreground uppercase">{user?.role?.name || "ROLE"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-primary/10 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="size-3" /> Full Name
                </p>
                <p className="text-sm font-medium">{user?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Mail className="size-3" /> Email Address
                </p>
                <p className="text-sm font-medium">{user?.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Shield className="size-3" /> Account Role
                </p>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-primary" />
                  <p className="text-sm font-medium">{user?.role?.name || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
