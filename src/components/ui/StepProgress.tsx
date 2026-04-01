import { cn } from "@/lib/utils"; // Optional: for conditional classNames if you're using shadcn UI
import { Progress } from "@/components/ui/progress";

type StepProgressProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

const StepProgress = ({ currentStep, totalSteps, className = "" }: StepProgressProps) => {
  const value = (currentStep / totalSteps) * 100;

  return (
    <div  className={cn(
        "flex items-center",
        className
      )}>
      <p className="text-xs font-semibold  text-text-brand-primary-main min-w-[30px]  ">
        {currentStep} / {totalSteps}
      </p>
      <Progress value={value} />
    </div>
  );
};

export default StepProgress;
