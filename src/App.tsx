import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useInitNotifications } from "./hooks/useInitNotifications";

function App() {
  useNotificationPermission();
  useAdminSocket();
  useInitNotifications();

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppRoutes />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
