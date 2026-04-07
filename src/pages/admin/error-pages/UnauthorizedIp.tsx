import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const UnauthorizedIp = () => {
  const [searchParams] = useSearchParams();
  const detectedIp = searchParams.get('ip');

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-0 border rounded-2xl shadow-sm p-8 text-center flex flex-col items-center gap-6">
        <div className="size-20 bg-red-100 rounded-full flex items-center justify-center">
          <WifiOff className="size-10 text-red-500" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-high-em">Access Restricted</h1>
          <p className="text-text-low-em">
            Your current network ID is not authorized to access this application. Please connect to a whitelisted network to continue.
          </p>
          {detectedIp && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-600 font-medium uppercase tracking-wider mb-1">Detected IP Address</p>
              <code className="text-sm font-mono text-red-700 bg-white px-2 py-1 rounded border border-red-200">
                {detectedIp}
              </code>
              <p className="text-[11px] text-red-500 mt-2">
                Ask your administrator to whitelist this IP.
              </p>
            </div>
          )}
        </div>

        <Button onClick={() => window.location.reload()} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedIp;
