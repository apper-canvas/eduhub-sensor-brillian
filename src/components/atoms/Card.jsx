import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    {...props}
  >
    {children}
  </h3>
));

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props}>
    {children}
  </div>
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };