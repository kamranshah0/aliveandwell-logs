import { toast } from "sonner";
 
export const notify = {
  success: (msg: string, desc?: string, duration = 3000) =>
    toast.success(msg, {
      description: desc,
      duration,
      style: {
        display: "flex",
        background: "white",
        color: "#263041",
        border: "1px solid #32D583",
        borderRadius: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      classNames: {
        icon: "text-[#32D583] size-[20px_!important]",
        title: "font-bold",
        description: "text-[14px_!important] font-medium",
        content: "gap-[0_!important]",
      },
    }),

  error: (msg: string, desc?: string, duration = 3000) =>
    toast.error(msg, {
      description: desc,
      duration,
      style: {
        display: "flex",
        background: "white",
        color: "#263041",
        border: "1px solid #F03D3D",
        borderRadius: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      classNames: {
        icon: "text-[#F03D3D] size-[20px_!important]",
        title: "font-bold",
        description: "text-[14px_!important] font-medium",
        content: "gap-[0_!important]",
      },
    }),

  warning: (msg: string, desc?: string, duration = 3000) =>
    toast.warning(msg, {
      description: desc,
      duration,
      style: {
        display: "flex",
        background: "white",
        color: " #263041",
        border: "1px solid #FDC82C",
        borderRadius: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      classNames: {
        icon: "text-[#FDC82C] size-[20px_!important]",
        title: "font-bold",
        description: "text-[14px_!important] font-medium",
        content: "gap-[0_!important]",
      },
    }),

  info: (msg: string, desc?: string, duration = 3000) =>
    toast.info(msg, {
      description: desc,
      duration,
      style: {
        display: "flex",
        background: "white",
        color: "#263041",
        border: "1px solid #11465561",
        borderRadius: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      classNames: {
        icon: "text-[#114655] size-[20px_!important]",
        title: "font-bold",
        description: "text-[14px_!important] font-medium",
        content: "gap-[0_!important]",
      },
    }),
};
