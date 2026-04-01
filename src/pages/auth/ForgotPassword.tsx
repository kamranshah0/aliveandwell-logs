"use client";

import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import AuthInput from "@/components/shared/auth/AuthInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { notify } from "@/components/ui/notify";

import { forgotPassword } from "@/api/auth.api";
import { CircleCheck, MessageSquareText, UsersRound } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      notify.success("OTP sent to your email");
      navigate("/forgot-verify-otp", { state: { email } });
    },
    onError: (err: any) => {
      notify.error(
        err?.response?.data?.message || "Failed to send OTP"
      );
    },
  });

  const handleClick = (e: any) => {
    e.preventDefault();

    if (!email) {
      notify.error("Please enter your email");
      return;
    }

    mutation.mutate(email);
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center p-6">
        <div className="p-8 backdrop-blur-lg rounded-3xl bg-white/30 max-w-[450px] w-full">
          <div className="flex flex-col items-center text-center">
            <img src="images/logo.png" className="w-44 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Reset your password
            </h1>
            <p className="text-base leading-6 text-white font-light">
              Enter your registered email address, and we’ll send you an OTP.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-3">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address to receive OTP"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={CiMail}
            />

            <AuthButton
              onClick={handleClick}
              loading={mutation.isPending}
              className="mt-6"
            >
              Send OTP
            </AuthButton>

            <p className="text-center mt-4 text-white text-sm">
              Remembered your password?
              <Link to="/" className="ps-2 text-primary font-semibold">
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

export default ForgotPassword;
