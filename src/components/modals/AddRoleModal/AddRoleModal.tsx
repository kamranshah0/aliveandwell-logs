import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/useModalStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormLabelMd from "@/components/molecules/FormLabelMd";
import FormInput from "@/components/molecules/FormInput";
import FormSwitchGroupSm from "@/components/molecules/FormSwitchGroupSm";
import { notify } from "@/components/ui/notify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPermissions } from "@/api/permission.api";
import { createRole, updateRole } from "@/api/role.api";
import { mapPermissions } from "@/utils/permissionMapper";
import { z } from "zod";
import { useEffect } from "react";


// ===============================
// SCHEMA
// ===============================
const schema = z.object({
  role: z.string().min(1, "Role name required"),
  permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;


// ===============================
// COMPONENT
// ===============================
const RoleFormModal = () => {
  const queryClient = useQueryClient();

  const {
    isAddRoleModal,
    closeAddRoleModal,
    roleMode,
    selectedRole,
  } = useModalStore();

  const isEdit = roleMode === "edit";

  // ===============================
  // FORM
  // ===============================
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "",
      permissions: [],
    },
  });

  const { control, handleSubmit, register, reset, setValue } = methods;

  // ===============================
  // FETCH PERMISSIONS
  // ===============================
  const { data: rawPermissions } = useQuery({
    queryKey: ["permissions-raw"],
    queryFn: async () => {
      const res = await fetchPermissions();
      return res.data.data;
    },
  });

  const permissionGroups = rawPermissions
    ? mapPermissions(rawPermissions)
    : [];

  // ===============================
  // PREFILL ON EDIT
  // ===============================
  useEffect(() => {
    if (isEdit && selectedRole) {
      setValue("role", selectedRole.displayName);
      setValue(
        "permissions",
        selectedRole.permissions.map((p) => p.name)
      );
    } else {
      reset();
    }
  }, [isEdit, selectedRole]);

  // ===============================
  // CREATE ROLE
  // ===============================
  const { mutateAsync: createRoleMutate, isPending: creating } =
    useMutation({
      mutationFn: createRole,
      onSuccess: () => {
        notify.success("Role Created");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        closeAddRoleModal();
        reset();
      },
      onError: () => {
        notify.error("Failed", "Unable to create role");
      },
    });

  // ===============================
  // UPDATE ROLE
  // ===============================
  const { mutateAsync: updateRoleMutate, isPending: updating } =
    useMutation({
      mutationFn: ({ id, payload }: any) =>
        updateRole(id, payload),
      onSuccess: () => {
        notify.success("Role Updated");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        closeAddRoleModal();
        reset();
      },
      onError: () => {
        notify.error("Failed", "Unable to update role");
      },
    });

  // ===============================
  // SUBMIT
  // ===============================
  const onSubmit = async (values: FormValues) => {
    const permissionIds =
      rawPermissions
        ?.filter((p: any) => values.permissions.includes(p.name))
        .map((p: any) => p.id) || [];

    const payload = {
      name: values.role.toLowerCase().replace(/\s+/g, "_"),
      displayName: values.role,
      description: `${values.role} role`,
      permissionIds,
    };

    if (isEdit && selectedRole) {
      await updateRoleMutate({
        id: selectedRole.id,
        payload,
      });
    } else {
      await createRoleMutate(payload);
    }
  };

  return (
    <Dialog open={isAddRoleModal} onOpenChange={closeAddRoleModal}>
      <DialogContent className="bg-surface-0 rounded-2xl p-0 md:min-w-[750px] max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="border-b border-outline-low-em p-4 px-6">
          <h3 className="text-2xl font-medium">
            {isEdit ? "Edit Role" : "Add New Role"}
          </h3>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="grid grid-cols-12 gap-6 px-6 py-6 pb-32">

            {/* ROLE NAME */}
            <div className="col-span-12">
              <FormLabelLg className="mb-1">Role Name</FormLabelLg>
              <FormInput placeholder="Role name" {...register("role")} />
            </div>

            {/* PERMISSIONS */}
            <div className="col-span-12">
              <FormLabelLg>Permissions</FormLabelLg>

              {permissionGroups.map((group) => (
                <div key={group.module} className="mt-6">
                  <FormLabelMd className="capitalize mb-3">
                    {group.module}
                  </FormLabelMd>

                  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
                    <Controller
                      name="permissions"
                      control={control}
                      render={({ field }) => (
                        <FormSwitchGroupSm
                          options={Object.entries(group.actions).map(
                            ([action, permissionName]) => ({
                              label:
                                action.charAt(0).toUpperCase() +
                                action.slice(1),
                              value: permissionName,
                            })
                          )}
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="fixed bottom-0 left-0 w-full bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-4">
            <Button
              variant="ghost"
              type="button"
              onClick={closeAddRoleModal}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={creating || updating}>
              {isEdit
                ? updating
                  ? "Updating..."
                  : "Update Role"
                : creating
                ? "Creating..."
                : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormModal;
