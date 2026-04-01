import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import FormInput from "@/components/molecules/FormInput";
import FormLabel from "@/components/molecules/FormLabel";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import FieldError from "@/components/molecules/FieldError";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/notify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createUserSchema, {
  type CreateUserFormValues,
} from "@/schema/createUserSchema";
import { createAdminUser } from "@/api/admin.api";
import { useRoles } from "@/hooks/useRoles";
import { handleApiError } from "@/utils/handleApiError";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const { data: roleOptions = [], isLoading: rolesLoading } = useRoles();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      designation: "",
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      await createAdminUser(values);

      notify.success("Success", "User created successfully");
      navigate("/team-users");
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Users" path="/team-users" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>User Information</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormLabel>Full Name</FormLabel>
            <FormInput {...register("name")} />
            <FieldError error={errors.name?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Email</FormLabel>
            <FormInput type="email" {...register("email")} />
            <FieldError error={errors.email?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Password</FormLabel>
            <FormInput type="password" {...register("password")} />
            <FieldError error={errors.password?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Role</FormLabel>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  placeholder="Select Role"
                  options={roleOptions}
                  value={field.value}
                  onChange={field.onChange}
                  loading={rolesLoading}
                />
              )}
            />
            <FieldError error={errors.roleId?.message} />
          </div>

          <div className="col-span-12">
            <FormLabel>Designation</FormLabel>
            <FormInput
              {...register("designation")}
              placeholder="e.g. Physician, MBBS"
            />
            <FieldError error={errors.designation?.message} />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default CreateUser;
