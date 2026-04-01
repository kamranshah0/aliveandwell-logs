import { BsStars } from "react-icons/bs";
import type { ReactNode } from "react";

interface PrimaryMessageProps {
    children: ReactNode;
    className?: string;
}

const PrimaryMessage: React.FC<PrimaryMessageProps> = ({ children, className = "" }) => {
    return (
        <div className={`flex   items-center p-3 gap-1 bg-custom-bg-icon rounded-lg text-sm ${className}`}>
            <div className="text-text-brand-primary-main">
                <BsStars className="size-5" />
            </div>
            <p className="text-text-med-em font-medium">
                {children}
            </p>
        </div>
    );
};

export default PrimaryMessage;
