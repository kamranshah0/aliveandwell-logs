"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Box,
  CircleAlert,
  CircleCheck,
  Clock4,
  Inbox,
} from "lucide-react";
import { notify } from "@/components/ui/notify";

/* ============================
   API FUNCTIONS
============================ */
import {
  fetchPendingRefills,
  fetchDueSoonRefills,
  fetchPickupQueue,
  fetchCompletedRefills,
  approveRefillRequest,
  markRefillDelivered,
} from "@/api/refill.api";
import { formatDate } from "@/utils/dateUtils";

/* ============================
   EMPTY STATE
============================ */
const NoItems = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-10 opacity-60">
    <Inbox size={38} className="text-text-low-em" />
    <p className="text-text-low-em mt-3 text-base font-light">{label}</p>
  </div>
);

/* ============================
   MAIN COMPONENT
============================ */
const RefillMain = () => {
  const queryClient = useQueryClient();

  /* ----------------------------
     QUERIES
  ---------------------------- */

  const pendingQuery = useQuery({
    queryKey: ["refills", "pending"],
    queryFn: async () => {
      const res = await fetchPendingRefills();
      return res.data.data.requests;
    },
  });

  const dueSoonQuery = useQuery({
    queryKey: ["refills", "dueSoon"],
    queryFn: async () => {
      const res = await fetchDueSoonRefills(7); // default 7 days
      return res.data.data.data;
    },
  });

  const pickupQuery = useQuery({
    queryKey: ["refills", "pickup"],
    queryFn: async () => {
      const res = await fetchPickupQueue();
      return res.data.data.refills;
    },
  });

  const completedQuery = useQuery({
    queryKey: ["refills", "completed"],
    queryFn: async () => {
      const res = await fetchCompletedRefills();
      return res.data.data.refills;
    },
  });

  /* ----------------------------
     MUTATIONS
  ---------------------------- */

  const approveMutation = useMutation({
    mutationFn: approveRefillRequest,
    onSuccess: () => {
      notify.success("Refill approved");
      queryClient.invalidateQueries({ queryKey: ["refills"] });
    },
    onError: () => notify.error("Failed to approve refill"),
  });

  const deliverMutation = useMutation({
    mutationFn: markRefillDelivered,
    onSuccess: () => {
      notify.success("Refill marked as completed");
      queryClient.invalidateQueries({ queryKey: ["refills"] });
    },
    onError: () => notify.error("Failed to mark completed"),
  });

  /* ============================
     UI
  ============================ */
  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Refill Workflows"
        description="Manage medication refills, pickups, and deliveries"
      />

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending">Refill Needed</TabsTrigger>
          <TabsTrigger value="dueSoon">Due Soon</TabsTrigger>
          <TabsTrigger value="pickup">Pick Up Queue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* ============================
            REFILL NEEDED
        ============================ */}
        <TabsContent value="pending">
          <div className="border border-danger/30 rounded-xl p-6">
            <Header
              icon={<CircleAlert className="text-danger size-6" />}
              title="Refill Needed Queue"
              count={pendingQuery.data?.length}
              label="medications require immediate attention"
            />

            <div className="mt-6 flex flex-col gap-4">
              {!pendingQuery.data?.length && (
                <NoItems label="No refill requests pending" />
              )}

              {pendingQuery.data?.map((item: any) => (
                <ItemCard key={item.id}>
                  <ItemInfo
                    name={item.patientName}
                    medication={item.medicineName}
                    pharmacy={item.pharmacyName}
                    badge={<Badge variant="danger">{item.daysMessage}</Badge>}
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => approveMutation.mutate(item.id)}
                    >
                      Approve Refill
                    </Button>
                  </div>
                </ItemCard>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============================
            DUE SOON
        ============================ */}
        <TabsContent value="dueSoon">
          <div className="border border-yellow/30 rounded-xl p-6">
            <Header
              icon={<Clock4 className="text-yellow size-6" />}
              title="Due Soon Queue"
              count={dueSoonQuery.data?.length}
              label="medications due soon"
            />

            <div className="mt-6 flex flex-col gap-4">
              {!dueSoonQuery.data?.length && (
                <NoItems label="No due-soon medications" />
              )}

              {dueSoonQuery.data?.map((item: any) => (
                <ItemCard key={item.id}>
                  <ItemInfo
                    name={item.patientName}
                    medication={item.medicineName}
                    pharmacy={item.pharmacyName}
                    badge={<Badge variant="warning">{item.daysMessage}</Badge>}
                  />
                </ItemCard>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============================
            PICKUP QUEUE
        ============================ */}
        <TabsContent value="pickup">
          <div className="border border-primary/30 rounded-xl p-6">
            <Header
              icon={<Box className="text-primary size-6" />}
              title="Pickup Queue"
              count={pickupQuery.data?.length}
              label="ready for pickup"
            />

            <div className="mt-6 flex flex-col gap-4">
              {!pickupQuery.data?.length && (
                <NoItems label="No pickup items available" />
              )}

              {pickupQuery.data?.map((item: any) => (
                <ItemCard key={item.id}>
                  <ItemInfo
                    name={item.patientName}
                    medication={item.medicineName}
                    pharmacy={item.pharmacyName}
                    badge={<Badge variant="success">Ready</Badge>}
                  />

                  <Button
                    variant="secondary"
                    onClick={() => deliverMutation.mutate(item.id)}
                  >
                    Mark Completed
                  </Button>
                </ItemCard>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ============================
            COMPLETED
        ============================ */}
        <TabsContent value="completed">
          <div className="border border-success-500/30 rounded-xl p-6">
            <Header
              icon={<CircleCheck className="text-success-500 size-6" />}
              title="Completed Refills"
              count={completedQuery.data?.length}
              label="completed this month"
            />

            <div className="mt-6 flex flex-col gap-4">
              {!completedQuery.data?.length && (
                <NoItems label="No completed refills" />
              )}

              {completedQuery.data?.map((item: any) => (
                <ItemCard key={item.id}>
                  <ItemInfo
                    name={item.patientName}
                    medication={item.medicineName}
                    pharmacy={item.pharmacyName}
                    badge={
                      <Badge variant="success">
                        {formatDate(item.completedDate)}
                      </Badge>
                    }
                  />
                </ItemCard>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainWrapper>
  );
};

export default RefillMain;

/* ============================
   SMALL UI HELPERS
============================ */

const Header = ({
  icon,
  title,
  count,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  label: string;
}) => (
  <div className="flex gap-4 items-center">
    <div className="rounded-full size-12 bg-muted flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="font-medium text-xl">{title}</h2>
      <p className="text-sm text-text-low-em">
        {count ?? 0} {label}
      </p>
    </div>
  </div>
);

const ItemCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-center p-3 rounded-lg border bg-muted">
    {children}
  </div>
);

const ItemInfo = ({
  name,
  medication,
  pharmacy,
  badge,
}: {
  name: string;
  medication: string;
  pharmacy: string;
  badge: React.ReactNode;
}) => (
  <div>
    <h3 className="font-semibold">{name}</h3>
    <p className="text-sm text-text-low-em">{medication}</p>
    <div className="flex gap-2 mt-2">
      <Badge variant="outline">{pharmacy}</Badge>
      {badge}
    </div>
  </div>
);
