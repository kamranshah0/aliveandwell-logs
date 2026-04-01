// utils/mapPatients.ts
export const mapPatients = (raw: any[]) => {
  return raw.map((p) => ({
    id: p.id,
    name: p.name,
    dob: p.dob,
    phone: p.phone,

    pharmacy:
      p.assignedpharmacy?.length > 0
        ? p.assignedpharmacy.join(", ")
        : "—",

    // 👇 DISPLAY VALUE
    programsLabel:
      p.programs?.length > 0
        ? p.programs.map((prog: any) => prog.programName).join(", ")
        : "—",

    // 👇 REAL DATA (FOR MODALS / ACTIONS)
    programs: p.programs ?? [],

    medications: p.medicationscount ?? 0,
    status: p.status === "active" ? "active" : "inactive",
    email: p.email,
  }));
};
