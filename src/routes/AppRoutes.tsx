import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { useAuth } from "@/auth/useAuth";
import { NAV_ITEMS } from "@/constants/navigation";
import AuthenticationLoading from "@/components/molecules/AuthenticationLoading";

const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/Resetpassword"));
const VerifyOtp = lazy(() => import("@/pages/auth/VerifyOtp"));
const Register = lazy(() => import("@/pages/auth/Register"));
const AuthLayout = lazy(() => import("@/components/layout/authLayout/AuthLayout"));

const ShipmentDashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));
const DashboardSettings = lazy(() => import("@/pages/admin/dashboard/DashboardSettings"));
const ShippmentLayout = lazy(() => import("@/components/layout/admin/Layout"));
const RolesPermissions = lazy(() => import("@/pages/admin/roles-permissions/RolesPermissions"));
const Notification = lazy(() => import("@/pages/admin/notifications/Notification"));
const Pharmacies = lazy(() => import("@/pages/admin/pharmacies/PharmaciesMain"));
const Pharmacy = lazy(() => import("@/pages/admin/pharmacies/PharmacyDetails"));
const MedicationsDashboard = lazy(() => import("@/pages/admin/medications/dashboard/MedicationsDashboard"));
const PatientsDashboard = lazy(() => import("@/pages/admin/patients/dashboard/PatientsDashboard"));
const CreatePatient = lazy(() => import("@/pages/admin/patients/create-update-patient/CreatePatient"));
const CreatePercription = lazy(() => import("@/pages/admin/medications/create-perscription/CreatePercription"));
const ViewPatient = lazy(() => import("@/pages/admin/patients/view-patient/ViewPatient"));
const ViewMedication = lazy(() => import("@/pages/admin/pharmacies/view-medication/ViewMedication"));
const DailyLog = lazy(() => import("@/pages/admin/daily-log/DailyLog"));
const SettingMain = lazy(() => import("@/pages/admin/settings/SettingMain"));
const ReportDashboard = lazy(() => import("@/pages/admin/reports/ReportDashboard"));
const LogReportDashboard = lazy(() => import("@/pages/admin/daily-log-reports/LogReportDashboard"));
const DailyLogFields = lazy(() => import("@/pages/admin/daily-log/DailyLogFields"));
const RefillMain = lazy(() => import("@/pages/admin/refills/RefillMain"));
const TeamUsers = lazy(() => import("@/pages/admin/team-users/TeamUsers"));
const ViewUser = lazy(() => import("@/pages/admin/team-users/view-user/ViewUser"));
const CreateMedicine = lazy(() => import("@/pages/admin/medicines/create-medicine/CreateMedicine"));
const EditMedicine = lazy(() => import("@/pages/admin/medicines/edit-medicine/EditMedicine"));
const MedicinesDashboard = lazy(() => import("@/pages/admin/medicines/dashboard/MedicinesDashboard"));
const EditMedication = lazy(() => import("@/pages/admin/medications/edit-medication/EditMedication"));
const Profile = lazy(() => import("@/pages/admin/profile/Profile"));
const NotFound = lazy(() => import("@/pages/admin/error-pages/NotFound"));
const EditPatient = lazy(() => import("@/pages/admin/patients/create-update-patient/EditPatient"));
const CreateUser = lazy(() => import("@/pages/admin/team-users/create-user/CreateUser"));
const PorgramDashboard = lazy(() => import("@/pages/admin/programs/ProgramDashboard"));
const DrugCategoryDashboard = lazy(() => import("@/pages/admin/drug-categories/dashboard/DrugCategoryDashboard"));
const CreateDrugCategory = lazy(() => import("@/pages/admin/drug-categories/create-drug-category/CreateDrugCategory"));
const EditDrugCategory = lazy(() => import("@/pages/admin/drug-categories/edit-drug-category/EditDrugCategory"));
const DosageFormDashboard = lazy(() => import("@/pages/admin/dosage-forms/dashboard/DosageFormDashboard"));
const CreateDosageForm = lazy(() => import("@/pages/admin/dosage-forms/create-dosage-form/CreateDosageForm"));
const EditDosageForm = lazy(() => import("@/pages/admin/dosage-forms/edit-dosage-form/EditDosageForm"));
const MedicationDosageDashboard = lazy(() => import("@/pages/admin/medication-dosages/dashboard/MedicationDosageDashboard"));
const CreateMedicationDosage = lazy(() => import("@/pages/admin/medication-dosages/create-dosage/CreateMedicationDosage"));
const EditMedicationDosage = lazy(() => import("@/pages/admin/medication-dosages/edit-dosage/EditMedicationDosage"));
const UnauthorizedIp = lazy(() => import("@/pages/admin/error-pages/UnauthorizedIp"));

function RootRedirect() {
  const { user, permissions, isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) return <AuthenticationLoading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const safePermissions = permissions || [];
  const username = user?.user?.username || user?.username || user?.user?.id || user?.id;

  // Special handle for Dashboard (which is on path "/")
  if (
    safePermissions.includes("dashboard.read") ||
    safePermissions.includes("logsDashboard.view")
  ) return <ShipmentDashboard />;

  // Find first allowed module dynamically
  const firstPermittedItem = NAV_ITEMS.find(
    (item) => item.path !== "/" && safePermissions.includes(item.permission)
  );

  if (firstPermittedItem) {
    return <Navigate to={firstPermittedItem.path} replace />;
  }

  return <NotFound />;
}

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<AuthenticationLoading />}>
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
          path="log-reports"
          element={
            <ProtectedRoute permission="admin.view">
              <LogReportDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="daily-log-config"
          element={
            <ProtectedRoute permission="admin.view">
              {(() => {
                const username = user?.user?.username || user?.username || user?.user?.id || user?.id;
                if (username === "sagar") {
                  return <DailyLogFields />;
                }
                return <Navigate to="/403" replace />;
              })()}
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard-config"
          element={
            <ProtectedRoute permission="admin.view">
              {(() => {
                const username = user?.user?.username || user?.username || user?.user?.id || user?.id;
                if (username === "sagar") {
                  return <DashboardSettings />;
                }
                return <Navigate to="/403" replace />;
              })()}
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

      {/* Standalone Error Routes */}
      <Route path="/unauthorized-access" element={<UnauthorizedIp />} />

      {/* Fallback Route */}
      <Route path="/*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
