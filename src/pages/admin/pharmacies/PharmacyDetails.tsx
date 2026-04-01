import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { Box, UsersRound } from "lucide-react";
import { LuBuilding2 } from "react-icons/lu";
import { RiCapsuleLine } from "react-icons/ri";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./medication-table/columns";
import type { DataTypes } from "./medication-table/types";
import { useEffect, useState } from "react";
import { getPharmacyById } from "@/api/pharmacy.api";
import type { PharmacyDetailsResponse } from "@/types/pharmacy-details.types";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/empty/EmptyState";
import { mapPatientMedications } from "@/utils/mapPatientMedications";
import { Skeleton } from "@/components/skeletons/skeleton";
import { useNavigate } from "react-router-dom";

const PharmacyDetails = () => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const { id } = useParams<{ id: string }>();
  const [tableData, setTableData] = useState<DataTypes[]>([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pharmacy-details", id],
    queryFn: async () => {
      const res = await getPharmacyById(id!);
      return res.data.data as PharmacyDetailsResponse;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!data?.patientMedications?.data) return;

    const decryptAndMap = async () => {
      const mapped = await mapPatientMedications(data.patientMedications.data);
      setTableData(mapped);
    };

    decryptAndMap();
  }, [data]);

  if (isError) {
    return (
      <MainWrapper>
        <EmptyState
          title="Unable to load pharmacy"
          description="Something went wrong while fetching pharmacy details."
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
      <SecondaryHeader title="Back to Pharmacies" onClick={handleGoBack} />

      {isLoading ? (
        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex rounded-full bg-primary/10 size-20  items-center justify-center">
              <LuBuilding2 className="text-text-primary size-6" />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>

          {/* ===== STATS SKELETON ===== */}
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-6 ">
          <div className="flex gap-4">
            <div className="flex rounded-full bg-primary/10 size-20  items-center justify-center">
              <LuBuilding2 className="text-text-primary size-6" />
            </div>
            <div>
              <h2 className="text-3xl text-text-high-em font-medium mb-1">
                {data?.name}
              </h2>
              <p className="text-base text-text-low-em">{data?.address}</p>
              <p className="text-base text-text-low-em">{data?.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex gap-2">
              <div className="bg-surface-1 size-12 flex items-center justify-center rounded-lg">
                <UsersRound className="size-6 text-primary" />
              </div>
              <div>
                <h4 className="text-sm text-text-low-em ">Total Patients</h4>
                <span className="text-2xl text-text-high-em font-medium">
                  {data?.statistics?.patientsCount ?? 0}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="bg-secondary/10 size-12 flex items-center justify-center rounded-lg">
                <RiCapsuleLine className="size-6 text-text-secondary" />
              </div>
              <div>
                <h4 className="text-sm text-text-low-em ">
                  Refills This Month
                </h4>
                <span className="text-2xl text-text-high-em font-medium">
                  {data?.statistics?.refillsThisMonth ?? 0}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="bg-yellow/10 size-12 flex items-center justify-center rounded-lg">
                <Box className="size-6 text-yellow" />
              </div>
              <div>
                <h4 className="text-sm text-text-low-em ">Pickup Pending</h4>
                <span className="text-2xl text-text-high-em font-medium">
                  {data?.statistics?.pickupPending ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )} 

      <div>
        <DataTable<DataTypes>
          columns={TableColumns}
          data={tableData}
          isLoading={isLoading}
        />
      </div>
    </MainWrapper>
  );
};

export default PharmacyDetails;
