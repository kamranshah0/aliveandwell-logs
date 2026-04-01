import { api } from "@/api/axios";

export const disenrollProgram = (enrollmentId: string) => {
  return api.delete(`/patient-programs/${enrollmentId}`);
};