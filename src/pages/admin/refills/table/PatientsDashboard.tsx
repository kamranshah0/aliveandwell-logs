import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import { TableData } from "./mock";
import type { DataTypes } from "./types";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import { notify } from "@/components/ui/notify";
import { Link } from "react-router-dom";

export default function PatientsDashboard() {
  const [data, setData] = useState<DataTypes[]>(TableData);

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Patients"
        description="Manage patient records and medication profiles"
        actionContent={
          <Link to="/patient/create">
            <Button>
              <UserPlus2 className="size-5" /> Add Patient
            </Button>
          </Link>
        }
      />

      <DataTable<DataTypes>
        columns={TableColumns}
        data={data}
        filters={DataFilters}
        onDelete={(id) => {
          setData((prev) => prev.filter((p) => p.id !== id));
          notify.success("Patient deleted successfully");
        }}
      />
    </MainWrapper>
  );
}
