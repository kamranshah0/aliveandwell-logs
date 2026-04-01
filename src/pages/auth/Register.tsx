import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import AuthInput from "@/components/shared/auth/AuthInput";
import AuthButton from "@/components/shared/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CircleCheck,
  MessageSquareText,
  UserRound,
  UsersRound,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();
    // Navigate to dashboard after login
    navigate("/");
  };

  return (
    <div className="grid grid-cols-13 min-h-screen bg-gradient-to-b from-[#194652] to-[#32831A]">
      <div className="lg:col-span-5 md:col-span-6 col-span-13 flex items-center justify-center md:p-6 p-3 ">
        <div className="md:p-10 p-8 backdrop-blur-lg rounded-3xl bg-white/30  max-w-[450px]">
          <div className="flex items-center justify-center flex-col">
            <img
              src={"images/logo.png"}
              alt="logo"
              className="w-[186.35px] object-contain mb-6"
            />

            <h1 className="text-2xl font-bold mb-3 text-white">
              Create Your Account
            </h1>
            <p className="text-base leading-6 text-white font-light text-center">
              Join Alive & Well to start managing medications efficiently
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-2">
            <AuthInput
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Enter your Full Name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={UserRound}
            />
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={CiMail}
            />

            <AuthInput
              id="password"
              label="Password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />
            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={IoKeyOutline}
              isPassword
            />

            <div className="w-full text-right mt-2 mb-8 flex justify-between items-center">
              <div className="flex  items-center">
                <Checkbox
                  id="rememberMe"
                  className="me-2 rounded-full size-3 ring-1 ring-secondary"
                />
                <Label htmlFor="rememberMe" className="text-white text-left">
                <p className="flex gap-1 flex-wrap text-sm">
                  I agree to the 
                  <Link to="/register" className="text-yellow  font-medium">
                    Terms of Service
                  </Link> 
                  and
                  <Link to="/login" className="text-yellow  font-medium">
                    Privacy Policy
                  </Link>
                </p>
                </Label>
              </div>
            </div>
            <AuthButton onClick={handleLogin}>Sign In</AuthButton>
            <p className="text-center mt-4 text-white font-light text-sm flex gap-1 justify-center">
              Already have an account?
              <Link to="/login" className="text-yellow text-sm font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="lg:col-span-8 md:col-span-7 md:block hidden">
        <div className="h-full relative ">
          <div className="circle bg-secondary/90 drop-shadow-lg size-15 rounded-full bottom-[20%] left-[20%] absolute"></div>

          <img
            src="/images/register-background.png"
            className=" object-cover w-full h-full absolute inset-0"
            alt=""
          />
          <div className="  bg-black/70 inset-0 absolute h-full w-full   flex items-center justify-center  text-center ">
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

export default Register;
