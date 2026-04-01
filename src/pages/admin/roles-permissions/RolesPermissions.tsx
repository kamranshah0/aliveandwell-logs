import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldUser, Pencil } from "lucide-react";
import AddRoleModal from "@/components/modals/AddRoleModal/AddRoleModal";
import { useModalStore } from "@/stores/useModalStore";
import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "@/api/role.api";
import { ACTIONS } from "@/utils/permissionParser";
import { groupRolePermissions } from "@/utils/groupRolePermissions";
import { Skeleton } from "@/components/skeletons/skeleton";

type Role = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: { id: string; name: string }[];
};

const RolesPermissions = () => {
  const { openCreateRoleModal, openEditRoleModal } = useModalStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await fetchRoles();
      return res.data.data as Role[];
    },
  });

  /* ===============================
      🔹 OPTIMIZATION (memoized)
     =============================== */
  const roles = useMemo(() => {
    if (!data) return [];
    return data.map((role) => ({
      ...role,
      grouped: groupRolePermissions(role.permissions),
    }));
  }, [data]);

  /* ===============================
/* ===============================
    🔹 LOADING SKELETON
   =============================== */
  if (isLoading) {
    return (
      <MainWrapper>
        <MainHeader
          title="Roles & Permissions"
          description="Manage roles and their assigned permissions"
        />

        <div className="rounded-xl border bg-surface-0 shadow-sm mt-6 overflow-hidden">
          <Table>
            {/* ===== TABLE HEADER SKELETON ===== */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px] ps-8">
                  <Skeleton className="h-4 w-24" />
                </TableHead>

                {ACTIONS.map((_, i) => (
                  <TableHead key={i} className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* ===== TABLE BODY SKELETON ===== */}
            <TableBody>
              {Array.from({ length: 3 }).map((_, roleIndex) => (
                <React.Fragment key={roleIndex}>
                  {/* ===== ROLE HEADER ===== */}
                  <TableRow className="bg-surface-2">
                    <TableCell
                      colSpan={ACTIONS.length + 1}
                      className="py-4 px-8"
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* ===== MODULE ROWS ===== */}
                  {Array.from({ length: 3 }).map((_, moduleIndex) => (
                    <TableRow key={moduleIndex}>
                      <TableCell className="ps-8">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>

                      {ACTIONS.map((_, i) => (
                        <TableCell key={i} className="text-center">
                          <Skeleton className="h-4 w-4 rounded-sm mx-auto" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </MainWrapper>
    );
  }

  /* ===============================
      🔹 ERROR STATE
     =============================== */
  if (isError) {
    return (
      <MainWrapper>
        <div className="text-center py-10 text-danger-500">
          Failed to load roles
        </div>
      </MainWrapper>
    );
  }

  /* ===============================
      🔹 MAIN UI
     =============================== */
  return (
    <>
      <MainWrapper>
        <MainHeader
          title="Roles & Permissions"
          description="Manage roles and their assigned permissions"
          actionContent={
            <Button onClick={openCreateRoleModal}>
              <ShieldUser className="size-5 mr-1" />
              Add Role
            </Button>
          }
        />

        <div className="rounded-xl border bg-surface-0 shadow-sm mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px] ps-8">Module</TableHead>
                {ACTIONS?.map((a) => (
                  <TableHead key={a} className="text-center capitalize">
                    {a}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {roles.map((role) => (
                <React.Fragment key={role.id}>
                  {/* ROLE HEADER */}
                  <TableRow className="bg-primary/10 border-t border-outline-low-em  ">
                    <TableCell
                      colSpan={ACTIONS?.length + 1}
                      className="py-3 px-8"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold capitalize text-primary">
                          {role.displayName}
                        </span>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditRoleModal(role)}
                        >
                          <Pencil className="size-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* MODULE ROWS */}
                  {Object.entries(role.grouped).map(([module, actions]) => (
                    <TableRow key={`${role.id}-${module}`}>
                      <TableCell className="capitalize ps-8">
                        {module}
                      </TableCell>

                      {ACTIONS?.map((action) => (
                        <TableCell key={action} className="text-center">
                          <Checkbox checked={actions?.has(action)} disabled />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </MainWrapper>

      {/* CREATE / EDIT MODAL */}
      <AddRoleModal />
    </>
  );
};

export default RolesPermissions;
