import { api } from "./axios";

export const fetchPatients = () => api.get("/admin/patients");

export const getPatientById = (cognitoId: string) =>
  api.get(`/admin/patients/${cognitoId}`);

export const createPatient = (data: FormData) => {
  return api.post("/admin/patients/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePatient = (cognitoId: string, data: FormData) =>
  api.put(`/admin/patients/${cognitoId}`, data);

export const bulkImportPatientsExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/admin/patients/bulk-import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* DELETE PATIENT */
export const deletePatient = async (cognitoId: string) => {
  const res = await api.delete(`/admin/patients/${cognitoId}`);
  return res.data;
};

/* BULK DELETE PATIENTS */
export const bulkDeletePatients = async (cognitoIds: string[]) => {
  const res = await api.post("/admin/patients/bulk-delete", { cognitoIds });
  return res.data;
};
