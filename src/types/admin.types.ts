export type AdminApiResponse = {
  username: string;
  email: string;
  name: string;
  roleId: string | null;
  designation: string | null;
  enabled: boolean;
  status: "CONFIRMED" | "UNCONFIRMED" | string;
  createdAt: string;
  lastModifiedAt: string;
assignedPatients?: number;
  phoneNumber?: string | null;
};

export type AdminUserCard = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "revoked";
  phone?: string | null;
};


export type AdminDetails = {
  cognitoUsername: string;
  email: string;
  enabled: boolean;
  userStatus: string;
  userCreateDate: string;
  name: string;
  roleId: string;
  designation?: string;
  attributes?: {
    phone_number?: string;
  };
  specialty?: string;
  department?: string;
  licenseNumber?: string;
  assignedPatients?: number;

};
