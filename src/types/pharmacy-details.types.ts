export type PatientMedicationApi = {
  patientId: string;
  patientName: string;
  medicineName: string; // 🔐 encrypted
  refillDate: string;
  nextRefillDate: string;
  dxDays: number;
  status: "ACTIVE" | "INACTIVE";
  hasRefill: boolean;
  medicationId: string;
};

export type PharmacyDetailsResponse = {
  id: string;
  name: string;
  address: string;
  phone: string;
  statistics: {
    patientsCount: number;
    refillsThisMonth: number;
    pickupPending: number;
    totalMedications: number;
  };
  patientMedications: {
    data: PatientMedicationApi[];
    total: number;     // ❌ ignore
    showing: string;   // ❌ ignore
  };
};
