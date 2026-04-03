import { useState, useContext } from "react";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "@/components/shared/auth/AuthInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CircleCheck, MessageSquareText, UsersRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login, logout as logoutApi } from "@/api/auth.api";
import { AuthContext } from "@/auth/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      const data = res.data.data;

      if (data.requiresMfa) {
        // ✅ MFA flow — role check will happen in VerifyOtp
        navigate("/verify-otp", {
          state: {
            email: data.email,
            session: data.session,
          },
        });
      } else {
        // ✅ Direct Success (No MFA) — role check here
        const roleName = data.roleName || data.role?.name;
        const allowedRoles = ["receptionist", "admin", "administrator"];
        if (roleName && !allowedRoles.includes(roleName)) {
          // Wrong role — block access
          try { await logoutApi(); } catch (_) {}
          setError("Access denied. This portal is for Receptionists and Administrators only.");
          return;
        }

        setAuth({
          user: {
            email: data.email,
            name: data.email.split("@")[0],
          },
          accessToken: data.accessToken,
          permissions: data.permissions || [],
        });

        navigate("/", { replace: true });
      }
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    },
  });

  // ✅ VALIDATION
  const validate = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!validate()) return;

    loginUser({ email, password });
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center p-6">
        <div className="p-8 backdrop-blur-lg rounded-3xl bg-white/30 max-w-[450px] w-full">
          <div className="flex flex-col items-center text-center">
            <img src="images/logo.png" className="w-44 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-base leading-6 text-white font-light text-center">
              Sign in to access your medication management dashboard
            </p>
          </div>

          {/* ✅ FORM */}
          <form
            className="mt-8 flex flex-col gap-3"
            onSubmit={handleLogin} // ENTER KEY WORKS
          >
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={CiMail}
            />

            <AuthInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            {/* ❌ ERROR MESSAGE */}
            {error && <p className="text-red-200 text-sm mt-1">{error}</p>}

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  className="me-2 size-4   ring-1 ring-secondary"
                />
                <Label htmlFor="rememberMe" className="text-white">
                  Remember me
                </Label>
              </div>

              <Link
                to="/forgot-password"
                className="text-yellow text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* ✅ SAME AUTH BUTTON WITH LOADING */}
            <AuthButton type="submit" loading={isPending} className="mt-6">
              Sign In
            </AuthButton>

            {/* <p className="text-center mt-4 text-white text-sm">
              Don’t have an account?
              <Link
                to="/register"
                className="text-yellow ps-1 font-medium"
              >
                Create one
              </Link>
            </p> */}
          </form>
        </div>
      </div>

      {/* RIGHT SIDE UI SAME */}
      <div className="lg:col-span-8 md:col-span-7 md:block hidden">
        <div className="h-full relative ">
          <div className="circle bg-secondary/90 drop-shadow-lg size-15 rounded-full bottom-[20%] left-[20%] absolute"></div>

          <img
            src="/images/register-background.png"
            className=" object-cover w-full h-full absolute inset-0"
            alt=""
          />
          <div className=" backdrop-blur-[2px] bg-black/70  inset-0 absolute h-full w-full   flex items-center justify-center  text-center ">
            <div className="flex flex-col gap-4 ">
              <h2 className="text-white font-bold text-4xl">
                Your Health, Connected.
              </h2>
              <p className="text-base text-white max-w-[500px]">
                Streamline medication management, improve patient care, and
                enhance collaboration across your healthcare team.
              </p>
            </div>
          </div>

          <div className=" bg-white/30 drop-shadow-xl size-15 flex items-center justify-center rounded-lg top-[10%] right-[20%] absolute">
            <CircleCheck className="size-8 text-yellow/80" />
          </div>
          <div className=" bg-white/30 drop-shadow-xl size-12 flex items-center justify-center rounded-lg top-[25%] right-[25%] absolute">
            <MessageSquareText className="size-6 text-white/80" />
          </div>

          <div className=" bg-white/30 drop-shadow-xl  size-14 flex items-center justify-center rounded-full bottom-[25%] right-[25%] absolute">
            <UsersRound className="size-7 text-secondary/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
