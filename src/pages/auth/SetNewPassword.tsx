import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LuUser } from "react-icons/lu";
import { IoKeyOutline } from "react-icons/io5";
import AuthInput from "@/components/shared/auth/AuthInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { completeNewPassword, logout as logoutApi } from "@/api/auth.api";
import { AuthContext } from "@/auth/AuthContext";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext)!;
  const state = location.state as { username?: string; session?: string } | null;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: completeNewPassword,
    onSuccess: async (res) => {
      const data = res.data.data;
      const roleName = data.roleName || data.role?.name;
      const permissions = data.permissions || [];
      const allowedRoles = [
        "receptionist",
        "admin",
        "administrator",
        "logs",
        "logs administrator",
        "logs_administrator",
      ];
      const canAccessLogsDashboard =
        permissions.includes("dashboard.read") ||
        permissions.includes("logsDashboard.view") ||
        (roleName && allowedRoles.includes(roleName.toLowerCase()));

      if (!canAccessLogsDashboard) {
        try {
          await logoutApi();
        } catch (_) {}
        setError(
          "Access denied. This portal is for Receptionists, Administrators, and Logs Administrators only.",
        );
        return;
      }

      setAuth({
        user: {
          user: {
            username: data.username,
            name: data.username,
            branchId: data.branchId,
            branchName: data.branchName,
          },
          role: {
            id: data.roleId,
            name: data.roleName,
            permissions,
          },
        },
        accessToken: data.accessToken,
        permissions,
      });

      navigate("/", { replace: true });
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "Unable to set password. Please ask an administrator for a new temporary password.",
      );
    },
  });

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setError(null);

    if (!state?.username || !state?.session) {
      setError("Password reset session is missing. Please login again.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    mutate({
      username: state.username,
      session: state.session,
      newPassword,
    });
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center p-6">
        <div className="p-8 backdrop-blur-lg rounded-3xl bg-white/30 max-w-[450px] w-full">
          <div className="flex flex-col items-center text-center">
            <img src="images/logo.png" className="w-44 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-base leading-6 text-white font-light text-center">
              Your temporary password worked. Create a new password to continue.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-3" onSubmit={handleSubmit}>
            <AuthInput
              id="username"
              label="Username"
              type="text"
              value={state?.username || ""}
              disabled
              Icon={LuUser}
            />

            <AuthInput
              id="newPassword"
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            {error && <p className="text-red-200 text-sm mt-1">{error}</p>}

            <AuthButton type="submit" loading={isPending} className="mt-6">
              Update Password
            </AuthButton>
          </form>
        </div>
      </div>

      <div className="lg:col-span-8 md:col-span-7 md:block hidden">
        <div className="h-full relative">
          <img
            src="/images/register-background.png"
            className="object-cover w-full h-full absolute inset-0"
            alt=""
          />
          <div className="backdrop-blur-[2px] bg-black/70 inset-0 absolute h-full w-full flex items-center justify-center text-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-white font-bold text-4xl">
                Secure Access, Updated.
              </h2>
              <p className="text-base text-white max-w-[500px]">
                Choose a private password before continuing to the logs dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
