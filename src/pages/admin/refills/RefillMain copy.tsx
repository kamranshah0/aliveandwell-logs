import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { SmartList } from "@/components/table/SmartList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert } from "lucide-react";
import { DataFilters } from "./table/filters";

import type { DataTypes } from "./table/types";
import { TableData } from "./table/mock";

export const refillData = [
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

const RefillMain = () => {
  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Refill Workflows"
        description="Manage medication refills, pickups, and deliveries"
      />

      <Tabs defaultValue="refill-neeed">
        <TabsList className="w-full border-none ">
          <TabsTrigger className="text-text-med-em" value="refill-neeed">
            Refill Needed
          </TabsTrigger>
          <TabsTrigger className="text-text-med-em" value="due-soon">
            Due Soon
          </TabsTrigger>
          <TabsTrigger className="text-text-med-em" value="pick-up-queue">
            Pick Up Queue
          </TabsTrigger>
          <TabsTrigger className="text-text-med-em" value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="refill-neeed">
            <div className="border border-danger/30 rounded-xl p-6 drop-shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="rounded-full size-12 bg-danger/10 flex items-center justify-center">
              <CircleAlert className="text-danger size-6" />
              </div>
              <div className="flex flex-col">
              <h2 className="font-medium text-xl text-text-high-em">
                Refill Needed Queue
              </h2>
              <p className="font-light text-text-low-em">
                {refillData.length} medications require immediate attention
              </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {refillData.map((item) => (
              <div key={item.id} className="flex p-3 justify-between items-center border border-danger/30 bg-danger/5 rounded-lg">
                <div>
                <h3 className="text-base font-semibold text-text-high-em">
                  {item.name}
                </h3>
                <p className="text-text-low-em">{item.medication}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="success">{item.pharmacy}</Badge>
                  <Badge variant="danger">{item.overdue}</Badge>
                </div>
                </div>

                <div className="flex gap-2">
                <Button variant="ghost">View Details</Button>
                <Button variant="secondary">Approve Refill</Button>
                <Button variant="ghost">Mark Completed</Button>
                </div>
              </div>
              ))}
            </div>
            </div>

          {/* <SmartList<DataTypes>
            data={TableData}
            filters={DataFilters}
            renderRow={(item) => (
              <div className="flex p-4 justify-between items-center border border-danger/30 bg-danger/5 rounded-lg">
                <div>
                  <h3 className="text-base font-semibold text-text-high-em">
                    {item.name}
                  </h3>
                  <p className="text-text-low-em">{item.medication}</p>

                  <div className="flex gap-2 mt-2">
                    <Badge variant="success">{item.pharmacy}</Badge>
                    <Badge variant="danger">{item.overdue}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost">View Details</Button>
                  <Button variant="secondary">Approve Refill</Button>
                  <Button variant="ghost">Mark Completed</Button>
                </div>
              </div>
            )}
          /> */}
        </TabsContent>
        <TabsContent value="notification">
          {/* // Notification  */}test notification
        </TabsContent>
      </Tabs>
    </MainWrapper>
  );
};

export default RefillMain;
