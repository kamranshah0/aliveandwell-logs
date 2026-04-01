export type MedicationApiItem = {
  id: string;
  rxId: string | null;
  quantity: number;
  refills: number;
  rxDurationDays: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;

  medicine: {
    name: string;
  };

  dosage: {
    title: string | null;
    value: number;
    unitType: string;
  };
};
