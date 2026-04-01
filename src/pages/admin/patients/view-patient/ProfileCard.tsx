import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Edit, Hospital, Mail, MapPin, Phone, TestTubes } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@/components/skeletons/skeleton";
import { formatDate } from "@/utils/dateUtils";

type Props = {
  data?: any;
  isLoading: boolean;
};

const ProfileCard: React.FC<Props> = ({ data, isLoading }) => {
  const [isInuranceRevealed, setIsInsuranceRevealed] = useState(false);
  const [isBackInuranceRevealed, setIsBackInsuranceRevealed] = useState(false);
  const [isIdRevealed, setIsIdRevealed] = useState(false);
  const [isIdBackRevealed, setIsIdBackRevealed] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        <Skeleton className="h-10 lg:w-1/2" />

        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-60 rounded-xl" />
          <Skeleton className="h-60 rounded-xl" />
          <Skeleton className="h-60 rounded-xl" />
          <Skeleton className="h-60 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const age =
    new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();

  return (
    <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div>
          <h2 className="lg:text-3xl md:text-2xl text-xl text-text-high-em font-bold  ">
            {data.fullName}
          </h2>
          <p className="md:text-base text-sm text-text-low-em">
            Patient ID: {data.patientId}
          </p>
        </div>

        <Link to={`/patient/edit/${data.cognitoId}`}>
          <Button>
            <Edit className="size-5" /> Edit Patient{" "}
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4  md:grid-cols-2   gap-4 gap-y-6 mb-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Age</h4>
          <div className="flex gap-2 items-center">
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {age} Years
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Date of Birth</h4>

          <div className="flex gap-2 items-center">
            <Calendar className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {formatDate(data.dateOfBirth)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Gender</h4>
          <div className="flex gap-2 items-center">
            <span className="md:text-base text-sm text-text-high-em font-semibold capitalize">
              {data.gender}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Phone</h4>
          <div className="flex gap-2 items-center">
            <Phone className="text-text-low-em size-5" />

            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.phone}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Email</h4>
          <div className="flex gap-2 items-center">
            <Mail className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.email}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Assigned Pharmacy</h4>
          {data?.assignedpharmacy?.map((pharmacy: any) => (
            <div className="flex flex-wrap">
              <Badge variant={"success"}>{pharmacy}</Badge>
            </div>
          ))}
        </div>

        {/* =======  */}

       

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Bin</h4>
          <div className="flex gap-2 items-center">
             
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.bin}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Insurance ID</h4>
          <div className="flex gap-2 items-center">
            <Hospital className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.insuranceId}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Insurance Name</h4>
          <div className="flex gap-2 items-center">
            <Hospital className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.insuranceName}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">last Cmp Lab</h4>
          <div className="flex gap-2 items-center">
            <TestTubes   className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.lastCmpLab}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Next Rx Date</h4>
          <div className="flex gap-2 items-center">
            <Calendar className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {formatDate(data.nextRxDate)}
            </span>
          </div>
        </div>


        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Office Location</h4>
          <div className="flex gap-2 items-center">
            <Building2 className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.officeLocation}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">PCN</h4>
          <div className="flex gap-2 items-center">
           
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.pcn}
            </span>
          </div>
        </div>

         <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">City</h4>
          <div className="flex gap-2 items-center">
            <Building2 className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.city}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">State</h4>
          <div className="flex gap-2 items-center">
            <Building2 className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.state}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Zip</h4>
          <div className="flex gap-2 items-center">
             
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.zip}
            </span>
          </div>
        </div>



        {/* ====== */}
      </div>
      <div className="grid grid-cols-1">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-text-low-em ">Address</h4>
          <div className="flex gap-2 items-center">
            <MapPin className="text-text-low-em size-5" />
            <span className="md:text-base text-sm text-text-high-em font-semibold">
              {data.address}
            </span>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" className="my-3" />

      <h3 className="text-text-high-em md:text-base text-sm font-semibold">
        Insurance & Identification
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="relative bg-surface-3 rounded-xl drop-shadow-xs border p-4 cursor-pointer select-none"
          onClick={() => setIsInsuranceRevealed(!isInuranceRevealed)}
        >
          {/* IMAGE */}
          <div className="h-60 rounded-xl overflow-hidden border bg-light-grey-100 relative">
            <img
              src={data.insuranceCardUrl}
              alt="Insurance Card"
              className={`w-full h-full object-cover transition-all duration-500 ease-in-out
            ${isInuranceRevealed ? "blur-0 scale-100" : "blur-md scale-105"}`}
            />

            {/* OVERLAY */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
            text-text-low-em transition-all duration-500 ease-in-out
            ${
              isInuranceRevealed
                ? "opacity-0"
                : "opacity-100 backdrop-blur-sm bg-white/80"
            }`}
            >
              <span className="text-sm font-medium text-text-low-em">
                Insurance Card Front
              </span>
              <span className="text-xs text-text-low-em">Click to view</span>
            </div>
          </div>

          <p className="text-text-low-em font-light mt-2">
            Blue Cross Blue Shield
          </p>
        </div>

        <div
          className="relative bg-surface-3 rounded-xl drop-shadow-xs border p-4 cursor-pointer select-none"
          onClick={() => setIsBackInsuranceRevealed(!isBackInuranceRevealed)}
        >
          {/* IMAGE */}
          <div className="h-60 rounded-xl overflow-hidden border bg-light-grey-100 relative">
            <img
              src={data.insuranceCardBackUrl}
              alt="Insurance Card"
              className={`w-full h-full object-cover transition-all duration-500 ease-in-out
            ${
              isBackInuranceRevealed ? "blur-0 scale-100" : "blur-md scale-105"
            }`}
            />

            {/* OVERLAY */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
            text-text-low-em transition-all duration-500 ease-in-out
            ${
              isBackInuranceRevealed
                ? "opacity-0"
                : "opacity-100 backdrop-blur-sm bg-white/80"
            }`}
            >
              <span className="text-sm font-medium text-text-low-em">
                Insurance Card Back
              </span>
              <span className="text-xs text-text-low-em">Click to view</span>
            </div>
          </div>

          <p className="text-text-low-em font-light mt-2">
            Blue Cross Blue Shield
          </p>
        </div>

        <div
          className="relative bg-surface-3 rounded-xl drop-shadow-xs border p-4 cursor-pointer select-none"
          onClick={() => setIsIdRevealed(!isIdRevealed)}
        >
          {/* IMAGE */}
          <div className="h-60 rounded-xl overflow-hidden border bg-light-grey-100 relative">
            <img
              src={data.idCardUrl}
              alt="Insurance Card"
              className={`w-full h-full object-cover transition-all duration-500 ease-in-out
            ${isIdRevealed ? "blur-0 scale-100" : "blur-md scale-105"}`}
            />

            {/* OVERLAY */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
            text-text-low-em transition-all duration-500 ease-in-out
            ${
              isIdRevealed
                ? "opacity-0"
                : "opacity-100 backdrop-blur-sm bg-white/80"
            }`}
            >
              <span className="text-sm font-medium text-text-low-em">
                ID Card Front
              </span>
              <span className="text-xs text-text-low-em">Click to view</span>
            </div>
          </div>

          <p className="text-text-low-em font-light mt-2">State Issued ID</p>
        </div>
        <div
          className="relative bg-surface-3 rounded-xl drop-shadow-xs border p-4 cursor-pointer select-none"
          onClick={() => setIsIdBackRevealed(!isIdBackRevealed)}
        >
          {/* IMAGE */}
          <div className="h-60 rounded-xl overflow-hidden border bg-light-grey-100 relative">
            <img
              src={data?.idCardBackUrl}
              alt="Insurance Card"
              className={`w-full h-full object-cover transition-all duration-500 ease-in-out
            ${isIdBackRevealed ? "blur-0 scale-100" : "blur-md scale-105"}`}
            />

            {/* OVERLAY */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
            text-text-low-em transition-all duration-500 ease-in-out
            ${
              isIdBackRevealed
                ? "opacity-0"
                : "opacity-100 backdrop-blur-sm bg-white/80"
            }`}
            >
              <span className="text-sm font-medium text-text-low-em">
                ID Card Back
              </span>
              <span className="text-xs text-text-low-em">Click to view</span>
            </div>
          </div>

          <p className="text-text-low-em font-light mt-2">State Issued ID</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
