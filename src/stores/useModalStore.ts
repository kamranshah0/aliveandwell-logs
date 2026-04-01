import type { SupplierType } from "@/pages/admin/supplier-customer/Suppliers";
import type { UserType } from "@/pages/admin/users-roles/Users";
import { create } from "zustand";

type RoleType = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: { id: string; name: string }[];
};

type ModalState = {

    // 🔐 Role form
  roleMode?: "create" | "edit";
  selectedRole?: RoleType | null;

  openCreateRoleModal: () => void;
  openEditRoleModal: (role: RoleType) => void;

  // --------- State
  isShipmentModalOpen: boolean;
  isShipmentFormModalOpen: boolean;
  isShipmentFormModalAiOpen: boolean;
  isAddRoleModal: boolean;
  isAddSupplierModal: boolean;
  isEditSupplierModal: boolean;
  isAddNewUserModal: boolean;
  isAddStopModal: boolean;
  isEditUserModal: boolean;
  selectedUser: UserType | null;
  selectedSupplier: SupplierType | null;
  isShipmentFormModalNewOpen: boolean;
  
  

  // --------- Open
  openShipmentModal: () => void;
  openShipmentFormModal: () => void;
  openShipmentFormModalAi: () => void;
  openAddRoleModal: () => void;
  openAddSupplierModal: () => void;
  openEditSupplierModal: (supplier: SupplierType) => void;
  openAddNewUserModal: () => void;
  openAddStopModal: () => void;
  openEditUserModal: (user: UserType) => void;
  openShipmentFormModalNew: () => void;
  
  // --------- Close
  closeShipmentModal: () => void;
  closeShipmentFormModal: () => void;
  closeShipmentFormModalAi: () => void;
  closeAddRoleModal: () => void;
  closeAddSupplierModal: () => void;
  closeEditSupplierModal: () => void;
  closeAddNewUserModal: () => void;
  closeAddStopModal: () => void;
  closeEditUserModal: () => void;
  closeShipmentFormModalNew: () => void;
};

export const useModalStore = create<ModalState>((set) => ({


  isAddRoleModal: false,

  roleMode: "create",
  selectedRole: null,

  // =========================
  // ROLE MODALS
  // =========================
  openCreateRoleModal: () =>
    set({
      isAddRoleModal: true,
      roleMode: "create",
      selectedRole: null,
    }),

  openEditRoleModal: (role) =>
    set({
      isAddRoleModal: true,
      roleMode: "edit",
      selectedRole: role,
    }),

  closeAddRoleModal: () =>
    set({
      isAddRoleModal: false,
      roleMode: "create",
      selectedRole: null,
    }),






  isShipmentModalOpen: false,
  isShipmentFormModalOpen: false,
  isShipmentFormModalAiOpen: false,
  // isAddRoleModal: false,
  isAddSupplierModal: false,
  isEditSupplierModal: false,
  isAddNewUserModal: false,
  isAddStopModal: false,
  isEditUserModal: false,
  selectedUser: null,
  selectedSupplier: null,
  isShipmentFormModalNewOpen: false,

  openShipmentFormModalNew: () => set({ isShipmentFormModalNewOpen: true }),
  closeShipmentFormModalNew: () => set({ isShipmentFormModalNewOpen: false }),

  openShipmentModal: () => set({ isShipmentModalOpen: true }),
  closeShipmentModal: () => set({ isShipmentModalOpen: false }),

  openShipmentFormModal: () => set({ isShipmentFormModalOpen: true }),
  closeShipmentFormModal: () => set({ isShipmentFormModalOpen: false }),

  openShipmentFormModalAi: () => set({ isShipmentFormModalAiOpen: true }),
  closeShipmentFormModalAi: () => set({ isShipmentFormModalAiOpen: false }),

  openAddRoleModal: () => set({ isAddRoleModal: true }),
  // closeAddRoleModal: () => set({ isAddRoleModal: false }),

  openAddSupplierModal: () => set({ isAddSupplierModal: true }),
  closeAddSupplierModal: () => set({ isAddSupplierModal: false }),

  openEditSupplierModal: (supplier) =>
    set({ isEditSupplierModal: true, selectedSupplier: supplier }),
  closeEditSupplierModal: () => set({ isEditSupplierModal: false }),

  openAddNewUserModal: () => set({ isAddNewUserModal: true }),
  closeAddNewUserModal: () => set({ isAddNewUserModal: false }),
 
  openAddStopModal: () => set({ isAddStopModal: true }),
  closeAddStopModal: () => set({ isAddStopModal: false }),

  openEditUserModal: (user) =>
    set({ isEditUserModal: true, selectedUser: user }),
  closeEditUserModal: () => set({ isEditUserModal: false }),
}));
