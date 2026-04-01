import { useState } from "react";

import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, CircleAlert, CircleCheck, Clock4, Inbox } from "lucide-react";
import { notify } from "@/components/ui/notify";

/* -----------------------------------------
   DEFAULT DATA 
----------------------------------------- */
const initialRefillNeeded = [
  {
    id: "1",
    name: "Emily Chen",
    medication: "Atorvastatin 20mg",
    pharmacy: "Walmart",
    overdue: "2 days overdue",
  },
  {
    id: "2",
    name: "Robert Brown",
    medication: "Synthroid 75mcg",
    pharmacy: "Pharmco",
    overdue: "5 days overdue",
  },
];

const initialDueSoon = [
  {
    id: "3",
    name: "John Doe",
    medication: "Metformin 500mg",
    pharmacy: "CVS",
    dueIn: "Due in 2 days",
  },
];

const initialPickUpQueue = [
  {
    id: "4",
    name: "Sarah Wilson",
    medication: "Lisinopril 10mg",
    pharmacy: "Pharmco",
    ready: "Ready for pickup",
  },
];

const initialCompleted = [
  {
    id: "5",
    name: "Michael Scott",
    medication: "Ibuprofen 200mg",
    pharmacy: "Walmart",
    completedAt: "Completed today",
  },
];

/* -----------------------------------------
   MAIN COMPONENT
----------------------------------------- */
const RefillMain = () => {
  const [refillNeeded, setRefillNeeded] = useState(initialRefillNeeded);
  const [dueSoon, setDueSoon] = useState(initialDueSoon);
  const [pickUpQueue, setPickUpQueue] = useState(initialPickUpQueue);
  const [completed, setCompleted] = useState(initialCompleted);

  /* -----------------------------------------
     ACTIONS 
  ----------------------------------------- */

  // Approve → Move to Pickup Queue
  const handleApprove = (item: any) => {
    setRefillNeeded(refillNeeded.filter((i) => i.id !== item.id));

    setPickUpQueue([
      ...pickUpQueue,
      {
        ...item,
        ready: "Approved — moving to pick up queue",
      },
    ]);

    notify.success("Refill approved and moved to Pick Up Queue");
  };

  // Completed → Move to Completed Tab
  const handleCompleted = (item: any, from: "refill" | "pickup") => {
    if (from === "refill") {
      setRefillNeeded(refillNeeded.filter((i) => i.id !== item.id));
    }

    if (from === "pickup") {
      setPickUpQueue(pickUpQueue.filter((i) => i.id !== item.id));
    }

    setCompleted([
      ...completed,
      {
        ...item,
        completedAt: "Completed just now",
      },
    ]);

    notify.success("Item marked as completed");
  };

  /* -----------------------------------------
     NO ITEMS COMPONENT
  ----------------------------------------- */
  const NoItems = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-10 opacity-60">
      <Inbox className="text-text-low-em" size={38} />
      <p className="text-text-low-em mt-3 text-base font-light">{label}</p>
    </div>
  );

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Refill Workflows"
        description="Manage medication refills, pickups, and deliveries"
      />

      <Tabs defaultValue="refill-needed" className="gap-6">
        <TabsList className="w-full border-none">
          <TabsTrigger value="refill-needed">Refill Needed</TabsTrigger>
          <TabsTrigger value="due-soon">Due Soon</TabsTrigger>
          <TabsTrigger value="pick-up-queue">Pick Up Queue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------ */}
        {/* REFILL NEEDED */}
        {/* ------------------------------------------------------ */}
        <TabsContent value="refill-needed">
          <div className="border border-danger/30 rounded-xl p-6 drop-shadow-sm">
            {/* Header */}
            <div className="flex gap-4 items-center">
              <div className="rounded-full size-12 bg-danger/10 flex items-center justify-center">
                <CircleAlert className="text-danger size-6" />
              </div>

              <div className="flex flex-col">
                <h2 className="font-medium text-xl text-text-high-em">Refill Needed Queue</h2>
                <p className="font-light text-text-low-em">
                  {refillNeeded.length} medications require immediate attention
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-6 flex flex-col gap-4">
              {refillNeeded.length === 0 && (
                <NoItems label="No refill requests pending" />
              )}

              {refillNeeded.map((item) => (
                <div
                  key={item.id}
                  className="flex p-3 justify-between items-center border border-danger/30 bg-danger/5 rounded-lg"
                >
                  <div>
                    <h3 className="text-base font-semibold text-text-high-em">{item.name}</h3>
                    <p className="text-text-low-em text-sm font-light">{item.medication}</p>

                    <div className="flex gap-2 mt-2">
                      <Badge variant="success">{item.pharmacy}</Badge>
                      <Badge variant="danger">{item.overdue}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost">View</Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleApprove(item)}
                    >
                      Approve Refill
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleCompleted(item, "refill")}
                    >
                      Mark Completed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------ */}
        {/* DUE SOON */}
        {/* ------------------------------------------------------ */}
        <TabsContent value="due-soon">
          <div className="border border-yellow/30 rounded-xl p-6 drop-shadow-sm">
            {/* Header */}
            <div className="flex gap-4 items-center">
              <div className="rounded-full size-12 bg-yellow/10 flex items-center justify-center">
                <Clock4 className="text-yellow size-6" />
              </div>

              <div className="flex flex-col">
                <h2 className="font-medium text-xl text-text-high-em">Due Soon Queue</h2>
                <p className="font-light text-text-low-em">
                  {dueSoon.length} medications due within 3 days
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {dueSoon.length === 0 && (
                <NoItems label="No due-soon medications" />
              )}

              {dueSoon.map((item) => (
                <div
                  key={item.id}
                  className="flex p-3 justify-between items-center border border-yellow/30 bg-yellow/5 rounded-lg"
                >
                  <div>
                    <h3 className="text-base font-semibold text-text-high-em">{item.name}</h3>
                    <p className="text-text-low-em text-sm font-light">{item.medication}</p>

                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{item.pharmacy}</Badge>
                      <Badge variant="warning">{item.dueIn}</Badge>
                    </div>
                  </div>

                  <Button>View Details</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------ */}
        {/* PICKUP QUEUE */}
        {/* ------------------------------------------------------ */}
        <TabsContent value="pick-up-queue">
          <div className="border border-primary/30 rounded-xl p-6 drop-shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="rounded-full size-12 bg-primary/10 flex items-center justify-center">
                <Box className="text-primary size-6" />
              </div>

              <div className="flex flex-col">
                <h2 className="font-medium text-xl text-text-high-em">Pickup Queue</h2>
                <p className="font-light text-text-low-em">
                  {pickUpQueue.length} medications ready for pickup
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {pickUpQueue.length === 0 && (
                <NoItems label="No pickup items available" />
              )}

              {pickUpQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex p-3 justify-between items-center border border-primary/30 bg-primary/5 rounded-lg"
                >
                  <div>
                    <h3 className="text-base font-semibold text-text-high-em">{item.name}</h3>
                    <p className="font-light text-text-low-em">
                      {item.medication}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <Badge variant="success">{item.pharmacy}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost">View</Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleCompleted(item, "pickup")}
                    >
                      Mark Completed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------ */}
        {/* COMPLETED */}
        {/* ------------------------------------------------------ */}
        <TabsContent value="completed">
          <div className="border border-secondary rounded-xl p-6 drop-shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="rounded-full size-12 bg-success-500/10 flex items-center justify-center">
                <CircleCheck className="text-success-500 size-6" />
              </div>

              <div className="flex flex-col">
                <h2 className="font-medium text-xl text-text-high-em">Completed This Month</h2>
                <p className="font-light text-text-low-em">
                  {completed.length} medications successfully finished
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {completed.length === 0 && (
                <NoItems label="No completed items yet" />
              )}

              {completed.map((item) => (
                <div
                  key={item.id}
                  className="flex p-3 justify-between items-center border border-secondary/30 bg-success-500/5 rounded-lg"
                >
                  <div>
                    <h3 className="text-base font-semibold text-text-high-em">{item.name}</h3>
                    <p className="text-text-low-em text-sm font-light">{item.medication}</p>

                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{item.pharmacy}</Badge>
                      <Badge variant="success">{item.completedAt}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainWrapper>
  );
};

export default RefillMain;
