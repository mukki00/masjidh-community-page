import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  text = "Loading...", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative flex items-center justify-center">
        <Spinner size={size} />
        <img 
          src="/favicon.ico" 
          alt="Mosque Logo" 
          className="absolute w-6 h-6 object-contain rounded-full"
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium">
          {text}
        </p>
      )}
    </div>
  )
}

export function FullPageLoading({ 
  text = "Loading...",
  className 
}: { text?: string; className?: string }) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg border bg-card shadow-lg">
        <div className="relative flex items-center justify-center">
          <Spinner size="lg" />
          <img 
            src="/favicon.ico" 
            alt="Mosque Logo" 
            className="absolute w-6 h-6 object-contain rounded-full"
          />
        </div>
        <p className="text-muted-foreground font-medium">{text}</p>
      </div>
    </div>
  )
}