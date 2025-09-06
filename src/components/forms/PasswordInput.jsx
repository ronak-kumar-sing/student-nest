"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function PasswordInput({ className, ...props }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        autoComplete="new-password"
        className={className}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1 h-8 w-8 hover:bg-transparent"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
