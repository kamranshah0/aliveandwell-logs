import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/Resetpassword";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import AuthLayout from "@/components/layout/authLayout/AuthLayout";

// Shipment Module

import ShipmentDashboard from "../pages/admin/dashboard/Dashboard";
import ShippmentLayout from "@/components/layout/admin/Layout";

import RolesPermissions from "@/pages/admin/roles-permissions/RolesPermissions";

import Notification from "@/pages/admin/notifications/Notification";
import Pharmacies from "@/pages/admin/pharmacies/PharmaciesMain";
import Pharmacy from "@/pages/admin/pharmacies/PharmacyDetails";
import MedicationsDashboard from "@/pages/admin/medications/dashboard/MedicationsDashboard";
import PatientsDashboard from "@/pages/admin/patients/dashboard/PatientsDashboard";
import CreatePatient from "@/pages/admin/patients/create-update-patient/CreatePatient";
import CreatePercription from "@/pages/admin/medications/create-perscription/CreatePercription";
import ViewPatient from "@/pages/admin/patients/view-patient/ViewPatient";
import ViewMedication from "@/pages/admin/pharmacies/view-medication/ViewMedication";
import Register from "@/pages/auth/Register";
import DailyLog from "@/pages/admin/daily-log/DailyLog";
import SettingMain from "@/pages/admin/settings/SettingMain";
import ReportDashboard from "@/pages/admin/reports/ReportDashboard";
import RefillMain from "@/pages/admin/refills/RefillMain";
import TeamUsers from "@/pages/admin/team-users/TeamUsers";
import ViewUser from "@/pages/admin/team-users/view-user/ViewUser";
import CreateMedicine from "@/pages/admin/medicines/create-medicine/CreateMedicine";
import EditMedicine from "@/pages/admin/medicines/edit-medicine/EditMedicine";
import MedicinesDashboard from "@/pages/admin/medicines/dashboard/MedicinesDashboard";
import EditMedication from "@/pages/admin/medications/edit-medication/EditMedication";
import Profile from "@/pages/admin/profile/Profile";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import NotFound from "@/pages/admin/error-pages/NotFound";
import EditPatient from "@/pages/admin/patients/create-update-patient/EditPatient";
import CreateUser from "@/pages/admin/team-users/create-user/CreateUser";
import PorgramDashboard from "@/pages/admin/programs/ProgramDashboard";
import DrugCategoryDashboard from "@/pages/admin/drug-categories/dashboard/DrugCategoryDashboard";
import CreateDrugCategory from "@/pages/admin/drug-categories/create-drug-category/CreateDrugCategory";
import EditDrugCategory from "@/pages/admin/drug-categories/edit-drug-category/EditDrugCategory";
import DosageFormDashboard from "@/pages/admin/dosage-forms/dashboard/DosageFormDashboard";
import CreateDosageForm from "@/pages/admin/dosage-forms/create-dosage-form/CreateDosageForm";
import EditDosageForm from "@/pages/admin/dosage-forms/edit-dosage-form/EditDosageForm";
import { useAuth } from "@/auth/useAuth";
import { NAV_ITEMS } from "@/constants/navigation";
import AuthenticationLoading from "@/components/molecules/AuthenticationLoading";
import MedicationDosageDashboard from "@/pages/admin/medication-dosages/dashboard/MedicationDosageDashboard";
import CreateMedicationDosage from "@/pages/admin/medication-dosages/create-dosage/CreateMedicationDosage";
import EditMedicationDosage from "@/pages/admin/medication-dosages/edit-dosage/EditMedicationDosage";

console.log("NAV_ITEMS loaded:", NAV_ITEMS);

function RootRedirect() {
  const { permissions, isAuthenticated, isAuthReady } = useAuth();

  console.log("RootRedirect state:", { isAuthReady, isAuthenticated, permissions });

  if (!isAuthReady) return <AuthenticationLoading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const safePermissions = permissions || [];

  // Special handle for Dashboard (which is on path "/")
  if (safePermissions.includes("admin.view")) return <ShipmentDashboard />;

  // Find first allowed module dynamically
  const firstPermittedItem = NAV_ITEMS.find(
    (item) => item.path !== "/" && safePermissions.includes(item.permission)
  );

  console.log("First permitted item:", firstPermittedItem);

  if (firstPermittedItem) {
    return <Navigate to={firstPermittedItem.path} replace />;
  }

  return <NotFound />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-otp" element={<VerifyOtp />} />
        <Route path="forgot-verify-otp" element={<ResetPassword />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        {/* <Route path="reset-password" element={<ResetPassword />} /> */}
      </Route>

      {/* Dashboard */}
      <Route element={<ShippmentLayout />}>
        <Route
          index
          element={<RootRedirect />}
        />
        <Route
          path="patients"
          element={
            <ProtectedRoute permission="patient.read">
              <PatientsDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route path="patients" element={<PatientsDashboard />} /> */}

        {/* <Route index element={<ShipmentDashboard />} />  */}
        {/* <Route path="users" element={
          <ProtectedRoute permission="users.read">
            <UsersPermissions />
          </ProtectedRoute>
        } /> */}

        {/* <Route path="profile/:id" element={<Profile />} /> */}

        <Route
          path="roles"
          element={
            <ProtectedRoute permission="role.read">
              <RolesPermissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="notifications"
          element={
            <ProtectedRoute permission="admin.view">
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="pharmacies"
          element={
            <ProtectedRoute permission="pharmacy.read">
              <Pharmacies />
            </ProtectedRoute>
          }
        />
        <Route
          path="pharmacy/:id"
          element={
            <ProtectedRoute permission="pharmacy.read">
              <Pharmacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/create"
          element={
            <ProtectedRoute permission="patient.create">
              <CreatePatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/view/:id"
          element={
            <ProtectedRoute permission="patient.read">
              <ViewPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/edit/:cognitoId"
          element={
            <ProtectedRoute permission="patient.update">
              <EditPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="medications"
          element={
            <ProtectedRoute permission="medication.read">
              <MedicationsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="medications/view-medication/:id"
          element={
            <ProtectedRoute permission="medication.read">
              <ViewMedication />
            </ProtectedRoute>
          }
        />
        <Route
          path="medication/create/percription"
          element={
            <ProtectedRoute permission="medication.create">
              <CreatePercription />
            </ProtectedRoute>
          }
        />
        <Route
          path="medication/edit/:id"
          element={
            <ProtectedRoute permission="medication.update">
              <EditMedication />
            </ProtectedRoute>
          }
        />

        <Route
          path="daily-log"
          element={
            <ProtectedRoute permission="dailyLog.read">
              <DailyLog />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute permission="">
              <SettingMain />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute permission="reports.read">
              <ReportDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="refills"
          element={
            <ProtectedRoute permission="refill.view">
              <RefillMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="team-users"
          element={
            <ProtectedRoute permission="admin.view">
              <TeamUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="team-users/view/:username"
          element={
            <ProtectedRoute permission="admin.view">
              <ViewUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="drug-categories"
          element={
            <ProtectedRoute permission="drugCategory.read">
              <DrugCategoryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dosage-forms"
          element={
            <ProtectedRoute permission="dosageForm.read">
              <DosageFormDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dosage-forms/create"
          element={
            <ProtectedRoute permission="dosageForm.create">
              <CreateDosageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="dosage-forms/edit/:id"
          element={
            <ProtectedRoute permission="dosageForm.update">
              <EditDosageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="medication-dosages"
          element={
            <ProtectedRoute permission="medication-dosage.read">
              <MedicationDosageDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="medication-dosages/create"
          element={
            <ProtectedRoute permission="medication-dosage.create">
              <CreateMedicationDosage />
            </ProtectedRoute>
          }
        />
        <Route
          path="medication-dosages/edit/:id"
          element={
            <ProtectedRoute permission="medication-dosage.update">
              <EditMedicationDosage />
            </ProtectedRoute>
          }
        />
        <Route
          path="medicines"
          element={
            <ProtectedRoute permission="medicine.read">
              <MedicinesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="medicines/create"
          element={
            <ProtectedRoute permission="medicine.create">
              <CreateMedicine />
            </ProtectedRoute>
          }
        />
        <Route
          path="medicines/edit/:id"
          element={
            <ProtectedRoute permission="medicine.update">
              <EditMedicine />
            </ProtectedRoute>
          }
        />

        <Route path="403" element={<NotFound />} />

        <Route
          path="drug-categories/create"
          element={
            <ProtectedRoute permission="drugCategory.create">
              <CreateDrugCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="drug-categories/edit/:id"
          element={
            <ProtectedRoute permission="drugCategory.update">
              <EditDrugCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/create"
          element={
            <ProtectedRoute permission="admin.create">
              <CreateUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="programs-dashboard"
          element={
            <ProtectedRoute permission="program.read">
              <PorgramDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute permission="admin.view">
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Route */}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
