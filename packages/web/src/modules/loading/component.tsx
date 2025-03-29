interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <output
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </output>
    </div>
  );
}

export default function LoadingComponent() {
  return (
    <div className="flex h-[25vh] w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
