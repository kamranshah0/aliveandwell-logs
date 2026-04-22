"use client";

import { useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import AuthInput from "@/components/shared/auth/AuthInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { notify } from "@/components/ui/notify";

import { confirmForgotPassword } from "@/api/auth.api";
import { CircleCheck, MessageSquareText, RotateCcwKey, UsersRound } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: confirmForgotPassword,
    onSuccess: () => {
      notify.success("Password reset successful");
      navigate("/login");
    },
    onError: (err: any) => {
      notify.error(
        err?.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    },
  });

  const handleClick = (e: any) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      notify.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error("Passwords do not match");
      return;
    }

    if (!username) {
      notify.error("Session expired. Please restart forgot password flow.");
      navigate("/forgot-password");
      return;
    }

    mutation.mutate({
      username,
      confirmationCode: otp,
      newPassword,
    });
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center p-6">
        <div className="p-8 backdrop-blur-lg rounded-3xl bg-white/30 max-w-[450px] w-full">
          <div className="flex flex-col items-center text-center">
            <img src="images/logo.png" className="w-44 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Create new password
            </h1>
            <p className="text-base leading-6 text-white font-light">
              Enter OTP and set your new password.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-3">
            <AuthInput
              id="otp"
              label="OTP Code"
              placeholder="Enter OTP from device/email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              Icon={RotateCcwKey}
            />

            <AuthInput
              id="newPassword"
              label="New Password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            <AuthInput
              id="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            <AuthButton
              loading={mutation.isPending}
              className="my-8"
              onClick={handleClick}
            >
              Reset Password
            </AuthButton>

            <p className="text-center text-white text-sm mt-4">
              Remembered your password?
              <Link to="/login" className="text-primary ps-1 font-semibold">
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE SAME */}
      <div className="lg:col-span-8 md:col-span-7 md:block hidden">
        <div className="backdrop-blur-lg bg-white/20 h-full flex items-center justify-center relative">
          <div className="text-center max-w-md">
            <h2 className="text-white font-bold text-4xl mb-4">
              Your Health, Connected.
            </h2>
            <p className="text-white">
              Secure access to your healthcare ecosystem.
            </p>
          </div>

          <div className="absolute top-[10%] right-[20%] bg-white/20 p-3 rounded-lg">
            <CircleCheck className="text-yellow-400" />
          </div>
          <div className="absolute top-[25%] right-[25%] bg-white/20 p-2 rounded-lg">
            <MessageSquareText className="text-white" />
          </div>
          <div className="absolute bottom-[25%] right-[25%] bg-white/30 p-3 rounded-full">
            <UsersRound className="text-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
