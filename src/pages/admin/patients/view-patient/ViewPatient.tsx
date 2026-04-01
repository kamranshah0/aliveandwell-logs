// src/pages/patients/ViewPatient.tsx
import React, { useMemo, useState, useEffect } from "react";
import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import ProfileCard from "./ProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/api/patient.api";
import { decryptText } from "@/utils/decryptAES";
import { Skeleton } from "@/components/skeletons/skeleton";

function badgeVariantForStatus(status: any) {
  switch (status) {
    case "active":
      return "default";
    case "due_soon":
      return "warning";
    case "refill_needed":
      return "danger";
    case "inactive":
      return "outline";
    case "overdue":
      return "danger";
    default:
      return "default";
  }
}
const MedicationRowSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-0 rounded-xl gap-2 border">
      {/* Left */}
      <div className="flex flex-col gap-2 w-1/3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Middle */}
      <div className="flex gap-6 w-1/2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Right button */}
      <Skeleton className="h-9 w-24" />
    </div>
  );
};
const MedicationRow: React.FC<{ med: any }> = ({ med }) => {
  const [decryptedName, setDecryptedName] = useState<string>("");
  const daysRemaining = med.remainingDays ?? 0;

  const variant = badgeVariantForStatus(
    med.status === "refill_needed" && daysRemaining === "Overdue"
      ? "overdue"
      : med.status,
  );

  useEffect(() => {
    const decrypt = async () => {
      const decrypted = await decryptText(med.medicineName);
      setDecryptedName(decrypted);
    };
    decrypt();
  }, [med.medicineName]);

  return (
    <div className="flex items-center justify-between p-4 bg-surface-0 rounded-xl gap-2 border drop-shadow-xs">
      <div className="flex flex-col gap-2">
        <span className="text-text-low-em text-sm">Medication</span>
        <p className="text-text-high-em font-medium text-base">
          {decryptedName}
        </p>
        <Badge variant={variant as any}>{med.pharmacyName}</Badge>
      </div>

      <div className="flex gap-6 items-center justify-center">
        <div className="flex flex-col gap-2">
          <span className="text-text-low-em text-sm">Next Refill</span>
          <p className="text-text-high-em font-medium text-base">
            {med.nextRefillDateFormatted ?? "—"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-text-low-em text-sm">Days Remaining</span>
          <p
            className={`text-text-high-em font-medium text-base ${
              daysRemaining === "Overdue"
                ? "text-red-600"
                : typeof daysRemaining === "number" && daysRemaining <= 3
                  ? "text-yellow-600"
                  : ""
            }`}
          >
            {daysRemaining === undefined
              ? "—"
              : daysRemaining === "Overdue"
                ? "Overdue"
                : `${daysRemaining} days`}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-text-low-em text-sm">Status</span>
          <Badge variant={variant as any}>{med.refillStatus}</Badge>
        </div>
      </div>

      <Link to={`/medications/view-medication/${med.id}`}>
        <Button variant={"ghost"}> View Details</Button>
      </Link>
    </div>
  );
};

const ViewPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["patient-view", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getPatientById(id!);
      return res.data.data;
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Patients" path="/patients" />

      <ProfileCard data={data} isLoading={isLoading} />

      {/* ===== MEDICATIONS (STATIC) ===== */}
      <div>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-2xl font-bold text-text-high-em">
            Active Medications
          </h3>

          {isLoading ? (
            <Skeleton className="h-6 w-10" />
          ) : (
            <span className="text-base text-secondary font-semibold">
              {data?.activeMedicationsCount ?? 0}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {isLoading ? (
            <>
              <MedicationRowSkeleton />
              <MedicationRowSkeleton />
              <MedicationRowSkeleton />
            </>
          ) : data?.medications?.length > 0 ? (
            data.medications.map((med: any) => (
              <MedicationRow key={med.id} med={med} />
            ))
          ) : (
            <div className="text-center py-10 text-text-low-em">
              No active medications
            </div>
          )}
        </div>
      </div>
    </MainWrapper>
  );
};

export default ViewPatient;
