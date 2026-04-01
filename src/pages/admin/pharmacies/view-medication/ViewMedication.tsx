import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { Badge } from "@/components/ui/badge";
import FormLabel from "@/components/molecules/FormLabel";
import FormSelect from "@/components/molecules/FormSelect";
import { Calendar } from "lucide-react";
import { RiCapsuleLine } from "react-icons/ri";
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { decryptText } from "@/utils/decryptAES";
import { Skeleton } from "@/components/skeletons/skeleton";
import EmptyState from "@/components/empty/EmptyState";
import { getMedicationById } from "@/api/medication.api";

const ViewMedication = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medication-view", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getMedicationById(id!);
      const m = res.data.data;

      const [medicineName, dosageTitle, notes, patientName] = await Promise.all(
        [
          decryptText(m.medicine?.name),
          decryptText(m.dosage?.title),
          decryptText(m.notes),
          decryptText(m.patientName || m.patient?.name),
        ],
      );

      const nextRefillDate = new Date(m.createdAt);
      nextRefillDate.setDate(
        nextRefillDate.getDate() + (m.rxDurationDays ?? 0),
      );

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (nextRefillDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      );

      return {
        medicineName,
        patient: {
          ...m.patient,
          name: patientName,
          patientId: m.rxId || m.patient?.patientId || "N/A",
        },
        status: m.status,
        rxDurationDays: m.rxDurationDays,
        createdAt: m.createdAt,
        pharmacy: m.pharmacy || m.medicine?.pharmacy,
        refills: m.refills,
        nextRefill: nextRefillDate.toDateString(),
        daysRemaining,
        dosage: dosageTitle,
        notes,
        category: m.category,
      };
    },
  });

  if (isLoading) {
    return (
      <MainWrapper className="flex flex-col gap-6">
        <SecondaryHeader title="Back to Medications" />

        {/* ===== TOP DETAIL CARD SKELETON ===== */}
        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <Skeleton className="size-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* GRID INFO */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 gap-y-6 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>

        {/* ===== STATUS MANAGEMENT SKELETON ===== */}
        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </MainWrapper>
    );
  }

  if (isError) {
    return (
      <MainWrapper>
        <EmptyState
          title="Unable to load medication"
          description="Something went wrong while fetching Medication details."
          action={
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm"
            >
              Retry
            </button>
          }
        />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Medications" path="/medications" />

      {/* ===== DETAIL CARD ===== */}
      <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="flex rounded-full bg-primary/10 size-16 items-center justify-center">
              <RiCapsuleLine className="text-text-primary size-6" />
            </div>
            <div>
              <h2 className="text-3xl font-medium mb-1">
                {data?.medicineName}
              </h2>
              <p className="text-base text-text-low-em">
                Patient: {data?.patient?.name} ({data?.patient?.patientId})
              </p>
            </div>
          </div>
          <div>
            <Badge variant="success">{data?.status}</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 gap-y-6 mb-2 mt-4">
          {/* Category */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Category</h4>
            <span className="md:text-base text-sm text-text-high-em font-medium">
              {data?.category || "—"}
            </span>
          </div>

          {/* RX Duration */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">RX Duration</h4>
            <div className="flex gap-2 items-center">
              <Calendar className="text-text-low-em size-5" />
              <span className="md:text-base text-sm text-text-high-em font-medium">
                {data?.rxDurationDays} Days
              </span>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Start Date</h4>
            <div className="flex gap-2 items-center">
              <Calendar className="text-text-low-em size-5" />
              <span className="md:text-base text-sm text-text-high-em font-medium">
                {new Date(data?.createdAt).toDateString()}
              </span>
            </div>
          </div>

          {/* Pharmacy */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Pharmacy</h4>
            <div className="flex gap-2 items-center">
              <LuBuilding2 className="text-yellow size-5" />
              <span className="md:text-base text-sm text-text-high-em font-medium">
                {data?.pharmacy?.name || "—"}
              </span>
            </div>
          </div>

          {/* Refills Remaining */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Refills Remaining</h4>
            <span className="md:text-base text-sm text-text-high-em font-medium">
              {data?.refills}
            </span>
          </div>

          {/* Next Refill Date */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Next Refill Date</h4>
            <span className="md:text-base text-sm text-text-high-em font-medium">
              {data?.nextRefill}
            </span>
          </div>

          {/* Days Remaining */}
          <div className="flex flex-col gap-1">
            <h4 className="text-sm text-text-low-em ">Days Remaining</h4>
            <span className="md:text-base text-sm text-text-high-em font-medium">
              {data?.daysRemaining} days
            </span>
          </div>
        </div>
      </div>

      {/* ===== STATUS MANAGEMENT ===== */}
      <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Status Management</h3>
          <Badge variant="success">{data?.status}</Badge>
        </div>

        <FormLabel className="mt-3">Change Status</FormLabel>
        <FormSelect
          options={[
            { label: "Pickup", value: "pickup" },
            { label: "Delivered", value: "delivered" },
          ]}
        />
      </div>
    </MainWrapper>
  );
};

export default ViewMedication;
