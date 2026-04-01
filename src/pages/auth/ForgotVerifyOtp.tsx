import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import OtpInput from "@/components/shared/auth/OtpInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { Label } from "@/components/ui/label";
import { verifyMfa } from "@/api/auth.api";
import { AuthContext } from "@/auth/AuthContext";
import { AlertCircle, CircleCheck, MessageSquareText, UsersRound } from "lucide-react";
 
const ForgotVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext)!;

  const { email, session } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !session) {
      navigate("/login", { replace: true });
    }
  }, [email, session, navigate]);

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: verifyMfa,
    onSuccess: (res) => {
      const data = res.data.data;

      setAuth({
        user: {
          email: data.email,
          name: data.name,
        },
        accessToken: data.accessToken,
        roleId: data.roleId,
      });
      // console.log(data.accessToken);

      navigate("/", { replace: true });
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    },
  });

  const runVerification = (finalOtp?: string) => {
    const code = finalOtp || otp;

    setError(null);

    if (code.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    verifyOtp({
      email,
      mfaCode: code,
      session,
      challengeName: "EMAIL_OTP",
    });
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center p-6">
        <div className="p-8 backdrop-blur-lg rounded-3xl bg-white/30 max-w-[450px] w-full">
          <div className="flex flex-col items-center text-center">
            <img src="images/logo.png" className="w-44 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify your Identity
            </h1>
            <p className="text-white text-sm">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Label className="text-white">Enter OTP</Label>

            <OtpInput
              onChange={setOtp}
              onComplete={runVerification}
              disabled={isPending}
            />

            {error && (
              <div className="flex items-center">
                <AlertCircle className="text-red-800 mr-2 size-5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <p className="mt-3 text-sm text-white">
              For your security, this code will expire in 5 minutes.
            </p>

            <AuthButton
              className="mt-6"
              onClick={runVerification}
              loading={isPending}
            >
              Verify & Continue
            </AuthButton>

            <p className="text-center text-white text-sm mt-4">
              Change email?
              <Link to="/login" className="text-primary ps-1 font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 md:col-span-7 md:block hidden">
        <div className="h-full backdrop-blur-lg bg-white/20 flex items-center justify-center relative">
          <div className="text-center max-w-md">
            <h2 className="text-4xl text-white font-bold mb-4">
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

export default ForgotVerifyOtp;
