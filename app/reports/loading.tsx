import { LoadingSpinner } from '@/components/ui/spinner'

export default function ReportsLoading() {
  return (
    <div className="min-h-screen gradient-bg-primary flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-lg p-8 border">
        <LoadingSpinner 
          size="lg" 
          text="Loading Reports..." 
        />
      </div>
    </div>
  )
}