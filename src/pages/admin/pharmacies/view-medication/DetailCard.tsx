import { Badge } from "@/components/ui/badge";
import { Calendar} from "lucide-react";
 
import { LuBuilding2 } from "react-icons/lu";
import { RiCapsuleLine } from "react-icons/ri";

const DetailCard = () => {
 
  return (
    <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="flex rounded-full bg-primary/10 size-16  items-center justify-center">
            <RiCapsuleLine className="text-text-primary size-6" />
          </div>
          <div>
            <h2 className="text-3xl text-text-high-em font-medium mb-1">
              Lisinopril 10mg
            </h2>
            <p className="text-base text-text-low-em">
              Patient: Sarah Mitchell ( PT-001 )
            </p>
          </div>
        </div>
        <div>
          <Badge variant={"success"}>Active</Badge>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3  grid-cols-2   gap-4 gap-y-6 mb-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">RX Duration</h4>
          <div className="flex gap-2 items-center">
            <Calendar className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-medium">
              30 Days
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Start Date</h4>

          <div className="flex gap-2 items-center">
            <Calendar className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-medium">
              1990-05-15
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Pharmacy</h4>
          <div className="flex gap-2 items-center">
            <LuBuilding2 className="text-yellow size-5" />
            <span className="md:text-base text-sm text-text-high-em font-medium">
              Pharmco
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Refills Remaining</h4>
          <div className="flex gap-2 items-center">
            <span className="md:text-base text-sm text-text-high-em font-medium">
              3
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Next Refill Date</h4>
          <div className="flex gap-2 items-center">
            <span className="md:text-base text-sm text-text-high-em font-medium">
              12-12-2025
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Days Remaining</h4>
          <span className="md:text-base text-sm text-text-high-em font-medium">
            10 days
          </span>
        </div>
      </div> 
    </div>
  );
};

export default DetailCard;
