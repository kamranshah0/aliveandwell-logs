import { CircleAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FieldErrorProps {
  error?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.span
          className="text-xs text-red-600 py-1 pt-3 px-2 flex items-center gap-1 font-medium"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
        >
          <CircleAlert className="size-4" />
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default FieldError;