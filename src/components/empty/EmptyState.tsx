type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

const EmptyState = ({
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-lg font-semibold text-text-high-em">
        {title}
      </h2>
      <p className="text-sm text-text-med-em mt-2 max-w-md">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
