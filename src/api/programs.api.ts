import { api } from "@/api/axios";

export const getAllPrograms = () => {
  return api.get("/admin/programs/stats/all");
};
 
export const enrollPatientProgram = (payload: {
  patientId: string;
  programId: string;
}) => api.post("/patient-programs", payload);