import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "border-transparent bg-gray-100 text-gray-800 border border-gray-200",
    destructive: "border-transparent bg-red-100 text-red-800 border border-red-200",
    outline: "border border-gray-300 text-gray-700",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200",
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge } 