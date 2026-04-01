import { Button } from "@/components/ui/button";

import { useModalStore } from "@/stores/useModalStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DialougeHeader from "@/components/molecules/DialougeHeader";
import { notify } from "@/components/ui/notify";
import MainWrapper from "@/components/molecules/MainWrapper";
import { useNavigate } from "react-router-dom";
import AddSupplierModal from "@/components/modals/AddSupplierModal/AddSupplierModal";
// import EditSupplierModal from "@/components/modals/AddUserModal/EditUserModal";
import SupplierCard from "./SupplierCard";
import EditSupplierModal from "@/components/modals/AddSupplierModal/EditSupplierModal";
import { Plus, X, ListFilter } from "lucide-react";
import { useMemo, useState } from "react"; // useMemo bhi add karo

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SupplierType = {
  id?: number;
  role?: string;
  email?: string;
  status?: "active" | "online" | "revoked";
  lastSeen?: string;
  city?: string;
  country?: string;
  companyLogo?: string;
  companyName?: string;
  companyRole?: string;
  firstName?: string;
  lastName?: string;
  cellNo?: string;
  address?: string;
};

function FilterBar({
  filters,
  setFilters,
}: {
  filters: { role?: string; status?: string; city?: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ role?: string; status?: string; city?: string }>
  >;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            <ListFilter className="size-4 text-text-high-em" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50 p-2" align="start">
          <DropdownMenuLabel className="mb-2 text-text-med-em text-xs font-medium">
            Filter by City
          </DropdownMenuLabel>
          <Select
            value={filters.city ?? "all"}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                city: value === "all" ? undefined : value,
              }))
            }
          >
            <SelectTrigger className="w-full p-2 bg-surface-2 border-0 rounded-md text-text-med-em text-xs font-medium shadow-none">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Karachi">Karachi</SelectItem>
              <SelectItem value="Lahore">Lahore</SelectItem>
              <SelectItem value="Islamabad">Islamabad</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        value={filters.role ?? "all"}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            role: value === "all" ? undefined : value,
          }))
        }
      >
        <SelectTrigger className="w-[160px] p-2 bg-surface-2 border-0 rounded-md text-xs font-medium shadow-none">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Manger">Manger</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            status: value === "all" ? undefined : value,
          }))
        }
      >
        <SelectTrigger className="w-[160px] p-2 bg-surface-2 border-0 rounded-md text-xs font-medium shadow-none">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="revoked">Revoked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const Suppliers = () => {
  const navigate = useNavigate();

  const filterLabel: Record<string, string> = {
    role: "Role",
    status: "Status",
    city: "City",
  };
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
    city?: string;
  }>({});

  const [suppliers, setSuppliers] = useState<SupplierType[]>([
    {
      id: 1,
      role: "Manger",
      email: "john.doe@gmail.com",
      status: "active",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/1.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
    {
      id: 2,
      role: "Admin",
      email: "farhan.ali@gmail.com",
      status: "active",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/2.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
    {
      id: 1,
      role: "Manger",
      email: "john.doe@gmail.com",
      status: "active",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/1.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
    {
      id: 2,
      role: "Admin",
      email: "farhan.ali@gmail.com",
      status: "active",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/2.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
    {
      id: 3,
      role: "Manger",
      email: "john.doe@gmail.com",
      status: "online",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/1.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
    {
      id: 4,
      role: "Admin",
      email: "farhan.ali@gmail.com",
      status: "revoked",
      lastSeen: "5m ago",
      city: "Karachi",
      country: "Pakistan",
      companyLogo: "/images/companies/2.png",
      companyName: "DHL Services",
      cellNo: "+92 300 1234567",
      firstName: "john",
      lastName: "Doe",
      address: "255 Washington ave ext, suite",
    },
  ]);



  const filteredSuppliers = useMemo(
  () =>
    suppliers.filter((s) => {
      const matchRole = filters.role ? s.role === filters.role : true;
      const matchStatus = filters.status ? s.status === filters.status : true;
      const matchCity = filters.city ? s.city === filters.city : true;
      return matchRole && matchStatus && matchCity;
    }),
  [suppliers, filters]
);

  const { openAddSupplierModal, openEditSupplierModal } = useModalStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setselectedSupplier] = useState<SupplierType | null>(
    null
  );
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const handleRevokeClick = (Supplier: SupplierType) => {
    setselectedSupplier(Supplier);
    setRevokeDialogOpen(true);
  };

  const confirmRevoke = () => {
    if (selectedSupplier) {
      setSuppliers((prev) =>
        prev.map((u) =>
          u.id === selectedSupplier.id ? { ...u, status: "revoked" } : u
        )
      );
      setRevokeDialogOpen(false);

      notify.success(
        "Supplier " +
          selectedSupplier.firstName +
          " " +
          selectedSupplier.lastName +
          " Revoked",
        "The supplier access has been revoked successfully."
      );
      setselectedSupplier(null);
    }
  };

  const handleDeleteClick = (Supplier: SupplierType) => {
    setselectedSupplier(Supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      setSuppliers((prev) => prev.filter((u) => u.id !== selectedSupplier.id));
      setDeleteDialogOpen(false);

      notify.success(
        "Supplier " +
          selectedSupplier.firstName +
          " " +
          selectedSupplier.lastName +
          " Deleted",
        "The Suuplier has been deleted successfully."
      );
      setselectedSupplier(null);
    }
  };
  const ViewProfile = (id: any) => {
    console.log("user id " + id);
    navigate(`/profile/${id}`); // id ke sath navigate
  };

  return (
    <>
      <div className="w-full bg-surface-0 p-4 px-6 mb-3 flex justify-between items-center">
        <FilterBar filters={filters} setFilters={setFilters} />
        <Button
          className="bg-side-panel-card text-primary hover:text-white"
          onClick={openAddSupplierModal}
        >
          <Plus className="size-4" />
          Add Supplier
        </Button>
      </div>

      <div className=" flex items-center gap-4 px-6 py-2">
        <p className="text-sm text-text-med-em">
          Showing ({filteredSuppliers.length})
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <div
                key={key}
                className="flex items-center gap-2 rounded-full bg-surface-0 border border-outline-med-em px-3 py-2 text-xs font-medium"
              >
                <span className="whitespace-nowrap">
                  {filterLabel[key] ?? key}:{" "}
                  <span className="font-semibold ml-1">{value}</span>
                </span>

                <button
                  aria-label={`Remove ${key} filter`}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, [key]: undefined }))
                  }
                  className="ml-1 inline-flex items-center justify-center rounded-full p-1 hover:bg-surface-2"
                >
                  <X className="size-4 text-text-low-em" />
                </button>
              </div>
            ) : null
          )}

          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => setFilters({})}
              className="ml-2 text-xs font-medium text-text-high-em underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <MainWrapper>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {suppliers.map((d) => (
            <SupplierCard
              key={d.id}
              Supplier={d}
              onEdit={() => openEditSupplierModal(d)}
              onDelete={() => handleDeleteClick(d)}
              ViewProfile={() => ViewProfile(d.id)}
              onRevoked={() => handleRevokeClick(d)}
            />
          ))}
        </div>
      </MainWrapper>

      <AddSupplierModal setSuppliers={setSuppliers} />
      <EditSupplierModal setSuppliers={setSuppliers} />
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className=" md:min-w-[530px] bg-surface-0 rounded-2xl p-0    gap-0 overflow-hidden">
          <DialougeHeader title="Delete Supplier" />

          <p className="px-6 py-3 text-text-high-em">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {selectedSupplier?.firstName + " " + selectedSupplier?.lastName}
            </span>{" "}
            ? Once user is removed this action cannot be undone.
          </p>

          <div className="  bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-5">
            <Button
              variant={"ghost"}
              className="rounded-lg "
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-lg flex items-center gap-2"
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent className=" md:min-w-[530px] bg-surface-0 rounded-2xl p-0 gap-0 overflow-hidden">
          <DialougeHeader title="Revoke Supplier" />

          <p className="px-6 py-3 text-text-high-em">
            Are you sure you want to revoke{" "}
            <span className="font-bold">
              {selectedSupplier?.firstName + " " + selectedSupplier?.lastName}
            </span>
            ? Once revoked, the supplier will lose access.
          </p>

          <div className="bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-5">
            <Button
              variant={"ghost"}
              className="rounded-lg "
              onClick={() => setRevokeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRevoke}
              className="rounded-lg flex items-center gap-2"
            >
              Yes, Revoke
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Suppliers;
