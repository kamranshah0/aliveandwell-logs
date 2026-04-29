import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Eye, Mail, Phone, Trash2, UserPlus2, User } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "@/api/admin.api";
import type { AdminApiResponse } from "@/types/admin.types";
import EmptyState from "@/components/empty/EmptyState";
import { Skeleton } from "@/components/skeletons/skeleton";
import { deleteAdmin } from "@/api/admin.api";
import { notify } from "@/components/ui/notify";
import { useState, useContext } from "react";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AuthContext } from "@/auth/AuthContext";

const TeamUsers = () => {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<any | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await getAllAdmins();
      return res.data.data as AdminApiResponse[];
    },
  });
 
const confirmDelete = async () => {
  if (!selectedUser?.username) return;

  try {
    setIsDeleting(true);

    await deleteAdmin(selectedUser.username);

    notify.success("User deleted", "Admin removed successfully");

    setDeleteDialogOpen(false);
    setSelectedUser(null);

    refetch();
  } catch (error) {
    notify.error("Failed", "Unable to delete user");
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Team Users"
        description="Manage staff members and access permissions"
        actionContent={
          (user?.username === "super_admin" || 
           user?.username === "sagar" || 
           user?.id === "sagar" || 
           user?.user?.username === "sagar" || 
           user?.user?.id === "sagar") && (
            <Link to="/user/create">
              <Button>
                <UserPlus2 className="size-5" /> Create User
              </Button>
            </Link>
          )
        }
      />

      {/* 🔄 ERROR */}
      {isError && (
        <EmptyState
          title="Unable to load users"
          description="Something went wrong while fetching users."
          action={
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          }
        />
      )}

      {/* ⏳ LOADING */}
      {isLoading && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-5 bg-surface-0 rounded-xl border space-y-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* ✅ DATA */}
      {!isLoading && data && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {data.map((user) => {
            return (
              <div
                key={user.username}
                className="flex flex-col gap-4 p-5 bg-surface-0 rounded-xl border"
              >
                <div className="flex justify-between gap-2">
                  <div className="flex gap-3">
                    <div
                      className={`size-12 flex items-center justify-center bg-primary text-white font-semibold rounded-full `}
                    >
                      {user.name?.charAt(0) ?? "U"}
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-medium text-text-high-em">
                        {user.name}
                      </h3>
                      <p className="text-sm text-text-low-em font-light">
                        {user.designation ?? "—"}
                      </p>
                      <Badge className="text-[10px]">{user.status}</Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8">
                        <BsThreeDotsVertical />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      {/* 👁 VIEW */}
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/team-users/view/${user.username}`)
                        }
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        View User
                        <Eye className="size-4" />
                      </DropdownMenuItem>

                      {/* ✏️ EDIT */}
                      {/* <DropdownMenuItem
                        onClick={() =>
                          navigate(`/team-users/edit/${user.username}`)
                        }
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        Edit User
                        <Edit className="size-4" />
                      </DropdownMenuItem> */}

                      {/* 🗑 DELETE */}
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-sm cursor-pointer text-danger-500"
                       onClick={() => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }}
                      >
                        Delete User
                        <Trash2 className="size-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-text-low-em" />
                    <p className="text-sm text-text-low-em">{user.username}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-text-low-em" />
                    <p className="text-sm text-text-low-em">
                      {user.phoneNumber ?? "—"}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-text-low-em">
                      Assigned Patients
                    </p>
                    <Badge variant="success" className="text-xs">
                     {user.assignedPatients}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}







      <DeleteConfirmModal
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? Once the user is removed, this action cannot be undone.`}
        isLoading={isDeleting}
      />

    </MainWrapper>
  );
};

export default TeamUsers;
