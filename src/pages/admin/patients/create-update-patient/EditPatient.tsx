import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/skeletons/skeleton";
import { useQueryClient } from "@tanstack/react-query";

import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import FormInput from "@/components/molecules/FormInput";
import FormLabel from "@/components/molecules/FormLabel";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import FieldError from "@/components/molecules/FieldError";
import UploadCard from "@/components/molecules/UploadCard";
import DatePicker from "@/components/molecules/DatePicker";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/notify";
import { useNavigate } from "react-router-dom";

import editPatientSchema, {
  type EditPatientFormValues,
} from "@/schema/editPatientSchema";
import { getPatientById, updatePatient } from "@/api/patient.api";
import { handleApiError } from "@/utils/handleApiError";

const EditPatient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cognitoId } = useParams<{ cognitoId: string }>();

  // NEW FILES
  const [isLoading, setIsLoading] = useState(true);
  const [insuranceFront, setInsuranceFront] = useState<File | null>(null);
  const [insuranceBack, setInsuranceBack] = useState<File | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  // EXISTING URL PREVIEWS
  const [existingDocs, setExistingDocs] = useState({
    insuranceCardUrl: "",
    insuranceCardBackUrl: "",
    idCardUrl: "",
    idCardBackUrl: "",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditPatientFormValues>({
    resolver: zodResolver(editPatientSchema),
    mode: "onChange",
  });

  // =========================
  // FETCH + PREFILL
  // =========================
  useEffect(() => {
    if (!cognitoId) return;

    const load = async () => {
      const res = await getPatientById(cognitoId);
      const p = res.data.data;

      reset({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        address: p.address,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender ? p.gender.toLowerCase() : p.gender,
        status: p.status,
        bin: p.bin,
        insuranceId: p.insuranceId,
        insuranceName: p.insuranceName,
        lastCmpLab: p.lastCmpLab,
        nextRxDate: p.nextRxDate,
        officeLocation: p.officeLocation,
        pcn: p.pcn,
        city: p.city,
        state: p.state,
        zip: p.zip,
      });

      setExistingDocs({
        insuranceCardUrl: p.insuranceCardUrl,
        insuranceCardBackUrl: p.insuranceCardBackUrl,
        idCardUrl: p.idCardUrl,
        idCardBackUrl: p.idCardBackUrl,
      });

      setIsLoading(false);
    };

    load();
  }, [cognitoId, reset]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("Form Validation Errors:", errors);
    }
  }, [errors]);

  // =========================
  // SUBMIT
  // =========================
  const onSubmit = async (values: EditPatientFormValues) => {
    try {
      if (!cognitoId) return;

      const fd = new FormData();

      // ✅ ONLY allowed fields
      const allowedFields: (keyof EditPatientFormValues)[] = [
        "firstName",
        "lastName",
        "phone",
        "address",
        "dateOfBirth",
        "gender",
        "status",
        "bin",
        "insuranceId",
        "insuranceName",
        "lastCmpLab",
        "nextRxDate",
        "officeLocation",
        "pcn",
        "city",
        "state",
        "zip",
      ];

      allowedFields.forEach((key) => {
        const val = values[key];
        if (typeof val === "string" && val !== "") {
          fd.append(key, val);
        }
      });

      // FILES
      if (insuranceFront) fd.append("insuranceCard", insuranceFront);
      if (insuranceBack) fd.append("insuranceCardBack", insuranceBack);
      if (idFront) fd.append("idCard", idFront);
      if (idBack) fd.append("idCardBack", idBack);

      await updatePatient(cognitoId, fd);
      notify.success("Updated", "Patient updated successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["usePatients"] });
      navigate("/patients");
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Patients" onClick={() => navigate(-1)} />

      {isLoading ? (
        <div className="bg-surface-0 rounded-xl p-6 space-y-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="col-span-6 h-12" />
            <Skeleton className="col-span-6 h-12" />
            <Skeleton className="col-span-6 h-12" />
            <Skeleton className="col-span-6 h-12" />
            <Skeleton className="col-span-12 h-12" />
          </div>
        </div>
      ) : (
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
            </div>

            <div className="col-span-6">
              <FormLabel>Email</FormLabel>
              <FormInput disabled {...register("email")} />
            </div>

            <div className="col-span-6">
              <FormLabel>Phone</FormLabel>
              <FormInput {...register("phone")} />
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
              <FieldError error={errors.dateOfBirth?.message} />
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
              <FieldError error={errors.gender?.message} />
            </div>

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
                    errors[field.name as keyof EditPatientFormValues]
                      ?.message as string
                  }
                />
              </div>
            ))}
          </div>

          <FormLabelLg>Documents</FormLabelLg>

          <div className="grid grid-cols-2 gap-4">
            <UploadCard
              label="Insurance Card"
              file={insuranceFront}
              existingUrl={existingDocs.insuranceCardUrl}
              onPick={setInsuranceFront}
              onRemove={() => setInsuranceFront(null)}
            />
            <UploadCard
              label="Insurance Card Back"
              file={insuranceBack}
              existingUrl={existingDocs.insuranceCardBackUrl}
              onPick={setInsuranceBack}
              onRemove={() => setInsuranceBack(null)}
            />
            <UploadCard
              label="ID Card"
              file={idFront}
              existingUrl={existingDocs.idCardUrl}
              onPick={setIdFront}
              onRemove={() => setIdFront(null)}
            />
            <UploadCard
              label="ID Card Back"
              file={idBack}
              existingUrl={existingDocs.idCardBackUrl}
              onPick={setIdBack}
              onRemove={() => setIdBack(null)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Patient"}
            </Button>
          </div>
        </form>
      )}
    </MainWrapper>
  );
};

export default EditPatient;
