import { decryptText } from "./decryptAES";

export async function mapMedicines(apiData: any[]) {
  return Promise.all(
    apiData.map(async (m) => ({
      id: m.id,
      medicationName: await decryptText(m.name),
      drugCategory: await decryptText(m.drugCategory?.name),
      formType: await decryptText(m.dosageForm?.name),
      pharmacy: m.pharmacy?.name ?? "-",
      status: m.status.toLowerCase(), // ACTIVE → active
    }))
  );
}
