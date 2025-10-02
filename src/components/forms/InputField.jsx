"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function InputField({ id, label, error, className, required, icon: Icon, ...props }) {
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="font-medium">
        {label}
        {required ? <span aria-hidden="true" className="text-red-600 ml-1">*</span> : null}
      </Label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <Input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            error && "border-red-500",
            Icon && "pl-10"
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
