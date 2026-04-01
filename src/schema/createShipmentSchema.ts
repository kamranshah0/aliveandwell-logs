import { z } from "zod";

export const dataRowSchema = z.object({
  id: z.number(),

  type: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  quantity: z.number().nonnegative(),
});

export const itemSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  hsCode: z.string().optional(),
  type: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  quantity: z.number().nonnegative(),
});

// ----------------------
// Main Form Schema
// ----------------------
export const createShipmentSchema = z
  .object({
    // Step 1
    shipmentName: z.string().min(1, "Shipment name is required"),
    domesticType: z.string().min(1, "Domestic type is required"), // Export / Import / Domestic
    domestic: z.string().min(1, "Domestic is required"),  
    shipmentType: z.string().min(1, "Shipment type is required"), // Consolidation / Single Shipment
    transportVia: z.string().min(1, "Transport method is required"), // Air / Sea / Rail / Land
    containerInfo: z.string().optional(), // FCL / LCL
    loadType: z.string().optional(), // FCL / LCL
    truckType: z.string().optional(), // Dropdown 
    containerDetails: z.array(dataRowSchema),
    serviceType: z.string().min(1, "Service Type is required"),
    pickupCompanyName: z.string().min(1, "Company Name is required"),
    devliveryCompanyName: z.string().min(1, "Company Name is required"),
    pickupAddress: z.string().min(1, "Pickup Address is required"),
    devliveryAddress: z.string().min(1, "Devlivery Address is required"),
    pickupDate: z.string().min(1, "Pickup Date is required"),
    pickupTime: z.string().min(1, " Pickup Time is required"),
    DeliveryTime: z.string().min(1, " Delivery Time is required"),
    contactPerson: z.string().min(1, " Contact Person is required"),
    phone: z.string().min(1, " Phone is required"),
    // cargoDate: z.string().datetime(),
    // deliveryDate: z.string().datetime(),
    cargoDate: z
      .date()
      .nullable() // allow null internally
      .refine((v) => v !== null, { message: "Cargo date is required" }),

    deliveryDate: z
      .date()
      .nullable()
      .refine((v) => v !== null, { message: "Delivery date is required" }),

    //----------- Step 2
    attachments: z.array(z.instanceof(File)),
    itemList: z.array(itemSchema).optional(),
    cargoType: z.string().min(1, "Cargo Type is required "), // Hazardous / Perishable / Oversized / Air Ride
    cargoTypeSwitch: z.array(z.string()),
    requiredTemperature: z.string().optional(),
    maxTemperature: z.string().optional(),
    unNumber: z.string().optional(),
    hazardClass: z.string().optional(),
    pkgGroup: z.string().optional(),

    // ------------ Step 3
    rfqExpiry: z.string().min(1, "RFQ expiry is required"),
    selectedSuppliers: z
    .array(z.string())
    .min(1, "At least one supplier must be selected"),

    // ------------ Step 4
      note: z.string().optional(), // required karna ho to .min(1, "Note is required")
  })
  .superRefine((data, ctx) => {
    // Container info rule
    if (["Sea"].includes(data.transportVia) && !data.containerInfo) {
      ctx.addIssue({
        path: ["containerInfo"],
        code: z.ZodIssueCode.custom,
        message: "Container info is required when transport is  Sea",
      });
    }
    if (["Land"].includes(data.transportVia) && !data.loadType) {
      ctx.addIssue({
        path: ["loadType"],
        code: z.ZodIssueCode.custom,
        message: "Load Type is required when transport is Land",
      });
    }

    // Hazardous Cargo rule
    if (data.cargoType === "Hazardous Cargo") {
      if (!data.unNumber) {
        ctx.addIssue({
          path: ["unNumber"],
          code: z.ZodIssueCode.custom,
          message: "UN number is required",
        });
      }
      if (!data.hazardClass) {
        ctx.addIssue({
          path: ["hazardClass"],
          code: z.ZodIssueCode.custom,
          message: "Hazard Class is required",
        });
      }
      if (!data.pkgGroup) {
        ctx.addIssue({
          path: ["pkgGroup"],
          code: z.ZodIssueCode.custom,
          message: "Pkg Group is required",
        });
      }
    }

    // Perishable Cargo rule
    if (data.cargoType === "Perishable Cargo" && !data.requiredTemperature && !data.maxTemperature) {
      ctx.addIssue({
        path: ["requiredTemperature"],
        code: z.ZodIssueCode.custom,
        message: "Required Temperature is mandatory",
      });
      ctx.addIssue({
        path: ["maxTemperature"],
        code: z.ZodIssueCode.custom,
        message: "Max Temperature is mandatory",
      });
    }
  });

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;
