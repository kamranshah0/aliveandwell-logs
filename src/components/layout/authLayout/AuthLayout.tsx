import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
 

export default function AuthLayout() {
  return (
    <>
      <main className="  ">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
