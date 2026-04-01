"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/useModalStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/schema/createUserSchema";

import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import { useState } from "react";
import { notify } from "@/components/ui/notify";
import { UploadIcon } from "lucide-react";
import { type UserType } from "@/pages/admin/users-roles/Users";

const AddNewUserModal = ({
  setUsers,
}: {
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
}) => {
  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const { isAddNewUserModal, closeAddNewUserModal } = useModalStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file chosen");

  const onSubmit = async (values: CreateUserFormValues) => {
    console.log("FINAL SUBMIT:", values);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notify.success("User Created", "The user has been added successfully.");

      setUsers((prev) => [
        ...prev,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          email: values.email,
          country: values.country,
          city: values.city,
          cellNo: values.cellNo,
          profileImg: preview || "",
          status: "active",
        },
      ]);

      closeAddNewUserModal();
    } catch (err) {
      notify.error("Something went wrong!", "Please try again later.");
    }
  };

  const DialougeHeader = ({ title }: { title: string }) => {
    return (
      <div className="border-b border-outline-low-em p-4 px-6 ">
        <h3 className="text-text-high-em text-2xl font-medium">{title}</h3>
      </div>
    );
  };

  return (
    <Dialog
      open={isAddNewUserModal}
      onOpenChange={() => {
        closeAddNewUserModal();
      }}
    >
      <DialogContent className="bg-surface-0 rounded-2xl p-0 md:min-w-[650px] max-h-[90vh] flex flex-col gap-0 overflow-hidden">
        <DialougeHeader title="Add New User" />
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto ">
          <div className="grid grid-cols-12 gap-6 px-6 py-4 pb-24">
            {/* Personal Information */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <FormLabelLg>Personal Information</FormLabelLg>
                </div>

                {/* Profile Upload with Preview */}
                <div className="col-span-12 flex items-center gap-6">
                  <div className="size-16 rounded-full border-1 border-dashed border-outline-med-em flex items-center justify-center overflow-hidden bg-surface-1 ">
                    {preview && (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <Controller
                    name="profileImg"
                    control={control}
                    render={() => (
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="profileUpload"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPreview(URL.createObjectURL(file));
                                  setFileName(file.name);
                                  setValue("profileImg", file, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor="profileUpload"
                              className="px-4 py-2 font-medium text-text-high-em rounded-lg cursor-pointer border-outline-med-em border flex items-center justify-center gap-1 text-sm hover:bg-surface-1 transition-all"
                            >
                              <UploadIcon className="size-4" />
                              Upload File
                            </label>
                          </div>
                          <span className="text-xs font-medium text-text-low-em">
                            {fileName}
                          </span>
                        </div>
                        <FieldError error={errors.profileImg?.message} />
                      </div>
                    )}
                  />
                </div>

                {/* Inputs */}
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>First Name</FormLabel>
                  <FormInput
                    placeholder="E.g ABC Name"
                    {...register("firstName")}
                  />
                  <FieldError error={errors.firstName?.message} />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Last Name</FormLabel>
                  <FormInput
                    placeholder="E.g ABC Name"
                    {...register("lastName")}
                  />
                  <FieldError error={errors.lastName?.message} />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    placeholder="E.g example@exp.com"
                    {...register("email")}
                  />
                  <FieldError error={errors.email?.message} />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Cell No.</FormLabel>
                  <FormInput placeholder="E.g 123" {...register("cellNo")} />
                  <FieldError error={errors.cellNo?.message} />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <FormLabelLg>Location Information</FormLabelLg>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Country</FormLabel>
                  <FormSelect
                     
                    placeholder="Select a Country"
                    options={[
                      { label: "United State", value: "United State" },
                      { label: "Pakistan", value: "Pakistan" },
                      { label: "India", value: "India" },
                    ]}
                    value={watch("country")}
                    onChange={(val) => setValue("country", val)}
                  />
                  <FieldError error={errors.country?.message} />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>City</FormLabel>
                  <FormSelect
                     
                    placeholder="Select a City"
                    options={[
                      { label: "New York", value: "New York" },
                      { label: "Alaska", value: "Alaska" },
                      { label: "Karachi", value: "Karachi" },
                      { label: "Delhi", value: "Delhi" },
                    ]}
                    value={watch("city")}
                    onChange={(val) => setValue("city", val)}
                  />
                  <FieldError error={errors.city?.message} />
                </div>
              </div>
            </div>

            {/* Assigned Role */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <FormLabelLg>Assigned Role</FormLabelLg>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Role</FormLabel>
                  <FormSelect
                  
                    placeholder="Select a role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Manager", value: "manager" },
                      { label: "User", value: "user" },
                    ]}
                    value={watch("role")}
                    onChange={(val) => setValue("role", val)}
                  />
                  <FieldError error={errors.role?.message} />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed footer */}
          <div className="fixed bottom-0 w-full bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-5">
            <Button
              variant={"ghost"}
              type="button"
              className="rounded-lg "
              onClick={closeAddNewUserModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUserModal;
