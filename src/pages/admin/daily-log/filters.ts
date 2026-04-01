export const DataFilters = [
  {
    title: "Search Logs",
    key: "search",
    type: "search",
    placeholder: "Search by patient name, rep, or doctor...",
    fields: ["firstName", "lastName", "representative", "doctorNpName"],
  },
  {
    title: "Lab Status",
    key: "lab",
    type: "select",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
];
