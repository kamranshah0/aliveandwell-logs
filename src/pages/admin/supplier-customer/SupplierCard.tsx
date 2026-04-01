import type { SupplierType } from "./Suppliers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Edit, BanIcon, Trash2, RotateCcw, Eye } from "lucide-react";

const SupplierCar = ({
  Supplier,
  onEdit,
  onDelete,
  ViewProfile,
  onRevoked
}: {
  Supplier: SupplierType;
  onEdit: () => void;
  onDelete: () => void;
  ViewProfile: () => void;
  onRevoked: () => void;
}) => {
  const getBadge = () => {
    switch (Supplier.status) {
      case "active":
        return (
          <Badge
            variant="success"
            className="px-2 py-1 text-xxs text-success-700 rounded-full"
          >
            <span className="size-1.5 rounded-full bg-success-600" /> Active
          </Badge>
        );
      case "online":
        return (
          <Badge
            variant="secondary"
            className="px-2 py-1 text-xxs rounded-full"
          >
            <span className="size-1.5 rounded-full bg-light-grey-600" /> Online{" "}
            {Supplier.lastSeen}
          </Badge>
        );
      case "revoked":
        return (
          <Badge
            variant="danger"
            className="px-2 py-1 text-xxs text-danger-600 rounded-full"
          >
            <span className="size-1.5 rounded-full bg-danger-600" /> Revoked
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-surface-0 rounded-xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`bg-slate-100 text-text-high-em p-3 rounded-xl ${
              Supplier.status === "revoked" ? "opacity-50" : ""
            }`}
          >
            <img
              src={Supplier.companyLogo}
              className="size-4 object-cover"
              alt=""
            />
          </div>
          <div className={Supplier.status === "revoked" ? "opacity-50" : ""}>
            <h3 className="text-base font-semibold text-text-high-em">
              {Supplier.firstName + " " + Supplier.lastName}
            </h3>
            <p className="text-xs text-text-low-em">{Supplier.role}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 bg-surface-2">
              <BsThreeDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-text-low-em border-b border-light-grey-100">
              Action
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={ViewProfile}
              className="flex items-center gap-2 px-4 py-2 text-xs text-text-med-em font-semibold cursor-pointer"
            >
              <Eye className="text-text-med-em" />
              <p className="text-text-med-em">View</p>
            </DropdownMenuItem>

            {/* 🔥 Edit now calls the onEdit prop */}
            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 text-xs text-text-med-em font-semibold cursor-pointer"
              onClick={onEdit}
            >
              <Edit className="size-4 text-text-med-em" />
              Edit
            </DropdownMenuItem>

            {Supplier.status !== "revoked" ? (
              <DropdownMenuItem onClick={onRevoked} className="flex items-center gap-2 px-4 py-2 text-xs text-text-med-em font-semibold cursor-pointer">
                <BanIcon className="size-4 text-text-med-em" />
                Revoke
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-xs text-text-med-em font-semibold cursor-pointer">
                <RotateCcw className="size-4 text-text-med-em" />
                Restore
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 text-xs text-text-med-em font-semibold cursor-pointer"
            >
              <Trash2 className="size-4 text-danger-500" />
              <p className="text-danger-500">Delete</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <p  className={`text-xs   text-text-low-em mb-2 ${
              Supplier.status === "revoked" ? "opacity-50" : ""
            }`}>{Supplier.address}</p>
        <div className="flex items-center justify-between gap-2">
          <div
            className={`text-xs   text-text-low-em ${
              Supplier.status === "revoked" ? "opacity-50" : ""
            }`}
          >
            <p className="mb-2">{Supplier.email}</p>
            <p>{Supplier.cellNo}</p>
          </div>
          {getBadge()}
        </div>
      </div>
    </div>
  );
};

export default SupplierCar;
