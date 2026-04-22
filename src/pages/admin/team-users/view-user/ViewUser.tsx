import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, UsersRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { RiCapsuleLine } from "react-icons/ri";
// import { DataTable } from "@/components/table/DataTable";
// import { useState } from "react";
import { getAdminByUsername } from "@/api/admin.api";
import { getRoleById } from "@/api/role.api";
import type { AdminDetails } from "@/types/admin.types";
import type { RoleDetails } from "@/types/role.types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/skeletons/skeleton";

const ViewUser = () => {
  const { username } = useParams<{ username: string }>();

  // 1️⃣ Fetch Admin
  const { data: adminRes, isLoading: adminLoading } = useQuery({
    queryKey: ["admin", username],
    queryFn: async () => {
      const res = await getAdminByUsername(username!);
      return res.data.data as AdminDetails;
    },
    enabled: !!username,
  });

  // 2️⃣ Fetch Role (dependent)
  const { data: roleRes, isLoading: roleLoading } = useQuery({
    queryKey: ["role", adminRes?.roleId],
    queryFn: async () => {
      const res = await getRoleById(adminRes!.roleId);
      return res.data.data as RoleDetails;
    },
    enabled: !!adminRes?.roleId,
  });

  const initials =
    adminRes?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "U";

  //  if (adminLoading) {
  //   return <MainWrapper>Loading...</MainWrapper>;
  // }

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Team" path="/team-users" />

      <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-6 ">
        <div className="flex gap-4 items-center">
          {adminLoading ? (
            <Skeleton className="size-24 rounded-full" />
          ) : (
            <div className="flex rounded-full bg-primary size-24 items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {adminLoading ? (
              <>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-medium">{adminRes?.name}</h2>
                <p className="text-text-low-em">
                  {adminRes?.designation ?? "—"}
                </p>
                <span className="flex gap-2">
                  <Badge>{adminRes?.userStatus}</Badge>
                  <Badge variant="secondary">{roleRes?.displayName}</Badge>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6  ">
          <h3 className="text-text-high-em text-xl font-medium mb-4">
            Contact Information
          </h3>

          <div className="flex flex-col gap-4">
            {adminLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="bg-primary/15 size-12 flex items-center justify-center rounded-xl">
                    <UsersRound className="size-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm text-text-low-em ">Username</h4>
                    <span className="text-base text-text-high-em font-medium">
                      {adminRes?.username || adminRes?.cognitoUsername}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-secondary/10 size-12 flex items-center justify-center rounded-xl">
                    <RiCapsuleLine className="size-6 text-text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm text-text-low-em ">Phone</h4>
                    <span className="text-base text-text-high-em font-medium">
                      {adminRes?.attributes?.phone_number || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-yellow/10 size-12 flex items-center justify-center rounded-xl">
                    <Calendar className="size-6 text-yellow" />
                  </div>
                  <div>
                    <h4 className="text-sm text-text-low-em ">Join Date</h4>
                    <span className="text-base text-text-high-em font-medium">
                      {new Date(adminRes!.userCreateDate).toDateString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6  ">
          <h3 className="text-text-high-em text-xl font-medium mb-4">
            Professional Details
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div>
                <h4 className="text-sm text-text-low-em ">Department</h4>
                {adminLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="text-base text-text-high-em font-medium">
                    {adminRes?.department || "—"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <div>
                <h4 className="text-sm text-text-low-em ">Specialty</h4>
                {adminLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="text-base text-text-high-em font-medium">
                    {adminRes?.specialty || "—"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <div>
                <h4 className="text-sm text-text-low-em ">License</h4>
                {adminLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="text-base text-text-high-em font-medium">
                    {adminRes?.licenseNumber || "—"}
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex gap-2">
              <div className="bg-primary/15 size-12 flex items-center justify-center rounded-xl">
                <UsersRound className="size-6 text-primary" />
              </div>
              <div>
                <h4 className="text-sm text-text-low-em ">Assigned Patients</h4>
                {adminLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="text-2xl text-text-high-em font-medium">
                    {adminRes?.assignedPatients || 0}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-0 rounded-xl p-6">
        <h3 className="text-xl font-medium mb-4">Permissions & Access</h3>

        <div className="grid gap-3 lg:grid-cols-3 md:grid-cols-2">
          {roleLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-4 bg-surface-1"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))
            : roleRes?.permissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex justify-between items-center border rounded-lg p-4 bg-surface-1"
                >
                  <div>
                    <h4 className="font-medium">{perm.displayName}</h4>
                    <p className="text-sm text-text-low-em">
                      {perm.description}
                    </p>
                  </div>
                  <Badge>Granted</Badge>
                </div>
              ))}
        </div>
      </div>
    </MainWrapper>
  );
};

export default ViewUser;
