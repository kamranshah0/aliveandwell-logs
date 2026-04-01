import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import FormInput from "@/components/molecules/FormInput";
import FormLabel from "@/components/molecules/FormLabel";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import { useQueryClient } from "@tanstack/react-query";
import FieldError from "@/components/molecules/FieldError";
import UploadCard from "@/components/molecules/UploadCard";
import DatePicker from "@/components/molecules/DatePicker";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/notify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createPatientSchema, {
  type CreatePatientFormValues,
} from "@/schema/createPatientSchema";
import { createPatient } from "@/api/patient.api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/utils/handleApiError";

const CreatePatient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [insuranceFront, setInsuranceFront] = useState<File | null>(null);
  const [insuranceBack, setInsuranceBack] = useState<File | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePatientFormValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: { status: "active" },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("Form Validation Errors:", errors);
    }
  }, [errors]);

  const onSubmit = async (values: CreatePatientFormValues) => {
    try {
      const fd = new FormData();

      Object.entries(values).forEach(([k, v]) => {
        if (typeof v === "string") fd.append(k, v);
      });

      if (insuranceFront) fd.append("insuranceCard", insuranceFront);
      if (insuranceBack) fd.append("insuranceCardBack", insuranceBack);
      if (idFront) fd.append("idCard", idFront);
      if (idBack) fd.append("idCardBack", idBack);

      await createPatient(fd);

      notify.success("Success", "Patient created successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["usePatients"] });
      navigate("/patients");
    } catch (error) {
      handleApiError(error, setError);
    }
  };
  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Patients" path="/patients" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Personal Information</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormLabel>First Name</FormLabel>
            <FormInput {...register("firstName")} />
            <FieldError error={errors.firstName?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Last Name</FormLabel>
            <FormInput {...register("lastName")} />
            <FieldError error={errors.lastName?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Email</FormLabel>
            <FormInput {...register("email")} />
            <FieldError error={errors.email?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Phone</FormLabel>
            <FormInput {...register("phone")} />
            <FieldError error={errors.phone?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Password</FormLabel>
            <FormInput type="password" {...register("password")} />
            <FieldError error={errors.password?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Confirm Password</FormLabel>
            <FormInput type="password" {...register("confirmPassword")} />
            <FieldError error={errors.confirmPassword?.message} />
          </div>

          <div className="col-span-6">
            <FormLabel>Date of Birth</FormLabel>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  setDate={(d) =>
                    field.onChange(d ? d.toISOString().slice(0, 10) : "")
                  }
                />
              )}
            />
          </div>

          <div className="col-span-6">
            <FormLabel>Gender</FormLabel>
            <FormSelect
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
              value={watch("gender")}
              onChange={(v) => setValue("gender", v as any)}
            />
          </div>

          <div className="col-span-12">
            <FormLabel>Address</FormLabel>
            <FormInput {...register("address")} />
          </div>

          {[
            { name: "bin", label: "BIN" },
            { name: "insuranceId", label: "Insurance ID" },
            { name: "insuranceName", label: "Insurance Name" },
            { name: "lastCmpLab", label: "Last CMP Lab" },
            { name: "nextRxDate", label: "Next Rx Date", type: "date" },
            { name: "officeLocation", label: "Office Location" },
            { name: "pcn", label: "PCN" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "zip", label: "Zip Code" },
          ].map((field) => (
            <div className="col-span-6" key={field.name}>
              <FormLabel>{field.label}</FormLabel>
              {field.type === "date" ? (
                <Controller
                  control={control}
                  name={field.name as any}
                  render={({ field: f }) => (
                    <DatePicker
                      date={f.value ? new Date(f.value) : undefined}
                      setDate={(d) =>
                        f.onChange(d ? d.toISOString().slice(0, 10) : "")
                      }
                    />
                  )}
                />
              ) : (
                <FormInput {...register(field.name as any)} />
              )}
              <FieldError
                error={
                  errors[field.name as keyof CreatePatientFormValues]
                    ?.message as string
                }
              />
            </div>
          ))}

          <div className="col-span-6">
            <FormLabel>Status</FormLabel>
            <FormSelect
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              value={watch("status")}
              onChange={(v) => setValue("status", v as any)}
            />
          </div>
        </div>

        <FormLabelLg>Documents</FormLabelLg>

        <div className="grid grid-cols-2 gap-4">
          <UploadCard
            label="Insurance Card"
            file={insuranceFront}
            onPick={setInsuranceFront}
            onRemove={() => setInsuranceFront(null)}
          />
          <UploadCard
            label="Insurance Card Back"
            file={insuranceBack}
            onPick={setInsuranceBack}
            onRemove={() => setInsuranceBack(null)}
          />
          <UploadCard
            label="ID Card"
            file={idFront}
            onPick={setIdFront}
            onRemove={() => setIdFront(null)}
          />
          <UploadCard
            label="ID Card Back"
            file={idBack}
            onPick={setIdBack}
            onRemove={() => setIdBack(null)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Patient"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default CreatePatient;
