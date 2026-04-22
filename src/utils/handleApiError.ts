import { AxiosError } from "axios";
import { notify } from "@/components/ui/notify";

type BackendError = {
  message: string[] | string;
  error: string;
  statusCode: number;
};

export const handleApiError = (
  error: unknown,
  setError?: (name: any, error: { message: string }) => void
) => {
  const err = error as AxiosError<BackendError>;

  const messages = err.response?.data?.message;

  if (!messages) {
    notify.error("Error", "Something went wrong");
    return;
  }

  // multiple errors
  if (Array.isArray(messages)) {
    messages.forEach((msg) => {
      notify.error("Validation Error", msg);

      // optional: attach to form
      if (setError) {
        if (msg.toLowerCase().includes("password")) {
          setError("password", { message: msg });
        }
        if (msg.toLowerCase().includes("phone")) {
          setError("phone", { message: msg });
        }
        if (msg.toLowerCase().includes("email already")) {
          setError("email", { message: msg });
        }
        if (msg.toLowerCase().includes("username already")) {
          setError("username", { message: msg });
        }
      }
    });
  } else {
    notify.error("Error", messages);
  }
};
