import { useQuery } from "@tanstack/react-query";
import { getPharmacies } from "@/api/pharmacy.api";
import { Link } from "react-router-dom";
import { RiCapsuleLine } from "react-icons/ri";

import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";
import EmptyState from "@/components/empty/EmptyState";

const Pharmacies = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async () => {
      const res = await getPharmacies();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Pharmacies"
        description="View and manage pharmacy partners"
      />

      {/* 🔄 LOADING STATE */}
      {isLoading && (
        <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PharmacyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ❌ ERROR STATE */}
      {isError && (
        <EmptyState
          title="Unable to load pharmacies"
          description="Something went wrong while fetching pharmacy data. Please try again."
          action={
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm"
            >
              Retry
            </button>
          }
        />
      )}

      {/* 📭 EMPTY DATA */}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          title="No pharmacies found"
          description="There are no pharmacy partners available at the moment."
        />
      )}

      {/* ✅ DATA STATE */}
      {!isLoading && !isError && data?.length > 0 && (
        <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6">
          {data.map((pharmacy: any) => (
            
             <Link
              key={pharmacy.id}
              to={`/pharmacy/${pharmacy.id}`}
            >  
              <DashbaordDetailCard
                title={pharmacy.name}
                iconClassName="bg-primary/10"
                icon={
                  <RiCapsuleLine className="size-4 text-text-primary" />
                }
                data={[
                  {
                    label: "Patients",
                    value:
                      pharmacy.statistics?.patientsCount ?? 0,
                  },
                  {
                    label: "Refills This Month",
                    value:
                      pharmacy.statistics?.refillsThisMonth ??
                      0,
                  },
                  {
                    label: "Pickup Pending",
                    value:
                      pharmacy.statistics?.pickupPending ??
                      0,
                  },
                ]}
              />
            </Link>
          ))}
        </div>
      )}
    </MainWrapper>
  );
};

export default Pharmacies;
