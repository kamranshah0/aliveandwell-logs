import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DataTypes } from "./types";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { UserPlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "@/api/patient.api";
import { mapPatients } from "@/utils/mapPatients";
import { notify } from "@/components/ui/notify";

export default function PatientsDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetchPatients();
      return mapPatients(res.data.data);
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Patients Dashboard"
        description="Manage patient records and medication profiles"
        actionContent={
          <Link to="/patient/create">
            <Button>
              <UserPlus2 className="size-5" /> Add Patient
            </Button>
          </Link>
        }
      />

      {isError && (
        <div className="text-center py-10 text-text-danger-em">
          Failed to load patients
        </div>
      )}

      <DataTable<DataTypes>
        columns={TableColumns}
        data={data ?? []}
        filters={DataFilters}
        onDelete={(id) => {
          console.log("Delete patient:", id);
          notify.success("Patient deleted successfully");
        }}
        isLoading={isLoading}
      />
    </MainWrapper>
  );
}
