import { api } from "@/api/axios";

/* =========================================================
   📌 REFILL REQUESTS (PENDING)
========================================================= */
export const fetchPendingRefills = () => {
  return api.get("/admin/medication-refill-requests/pending");
};

/* =========================================================
   ⏳ DUE SOON MEDICATIONS
   default days = 7 (UI me expose nahi)
========================================================= */
export const fetchDueSoonRefills = (days: number = 7) => {
  return api.get(`/admin/due-soon-medications/all/${days}`);
};

/* =========================================================
   📦 PICKUP QUEUE
========================================================= */
export const fetchPickupQueue = () => {
  return api.get("/admin/medication-refills/queue");
};

/* =========================================================
   ✅ COMPLETED REFILLS
========================================================= */
export const fetchCompletedRefills = () => {
  return api.get("/admin/medication-refills/completed");
};

/* =========================================================
   ✔️ APPROVE REFILL REQUEST
========================================================= */
export const approveRefillRequest = (requestId: string) => {
  return api.patch(
    `/admin/medication-refill-requests/${requestId}/approve`
  );
};

/* =========================================================
   🚚 MARK REFILL AS DELIVERED / COMPLETED
========================================================= */
export const markRefillDelivered = (refillId: string) => {
  return api.patch(
    `/admin/medication-refills/${refillId}/deliver`
  );
};
