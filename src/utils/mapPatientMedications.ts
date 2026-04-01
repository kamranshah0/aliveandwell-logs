 
import type { DataTypes } from "@/pages/admin/pharmacies/medication-table/types";
import type { PatientMedicationApi } from "@/types/pharmacy-details.types";
import { decryptText } from "./decryptAES";
 
 
export const mapPatientMedications = async (
  data: PatientMedicationApi[]
): Promise<DataTypes[]> => {
  return Promise.all(
    data.map(async (item) => ({
      id: item.medicationId,
      patient: item.patientName,
      medications: await decryptText(item.medicineName),
      refillDate: item.refillDate,
      status: item.status === "ACTIVE" ? "active" : "inactive",
    }))
  );
};
