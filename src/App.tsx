import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useInitNotifications } from "./hooks/useInitNotifications";
import { useAuth } from "@/auth/useAuth";

function BackgroundServices() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const enabled = isAuthReady && isAuthenticated;

  useNotificationPermission(enabled);
  useAdminSocket(enabled);
  useInitNotifications(enabled);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BackgroundServices />
        <AppRoutes />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

