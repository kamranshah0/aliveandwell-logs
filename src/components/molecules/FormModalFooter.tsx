// components/FormModalFooter.tsx

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FormModalFooterProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  isValid?: any;
  isSubmitting?: any;
  nextStep: () => void;
  prevStep: () => void;
  onFinalSubmit: () => void;
}

const FormModalFooter = ({
  activeStep,
  totalSteps,
  nextStep,
  prevStep,
  onFinalSubmit,
  isSubmitting,
}: FormModalFooterProps) => {
  return (
    <div className="md:px-[128px] px-[50px] py-4 flex items-center justify-between bg-surface-0 border-t border-outline-med-em">
      <Button
        type="button"
        variant="link"
        onClick={prevStep}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            prevStep();
          }
        }}
        disabled={activeStep === 1}

        className="py-3 px-6 text-text-low-em text-base font-semibold"
      >
        Back
      </Button>

      <div>
        <Button
        type="button"
          variant={"link"}
          className="py-3 px-6 text-text-low-em text-base font-semibold"
        >
          Save for later
        </Button>

        {activeStep === totalSteps ? (
          <Button onClick={onFinalSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Shipment"}{" "}
            <ArrowRight className="size-6" />
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            type="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                nextStep();
              }
            }}
          >
            Next <ArrowRight className="size-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormModalFooter;
