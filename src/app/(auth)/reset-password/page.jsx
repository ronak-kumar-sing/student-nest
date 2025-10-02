"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useRouter } from "next/navigation"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/forms/InputField"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Shield, AlertCircle } from "lucide-react"

const resetPasswordSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState("reset") // "reset" or "success"
  const router = useRouter()
  const searchParams = useSearchParams()

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const newPassword = watch("newPassword")

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-200"
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  async function onSubmit(values) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setStep("success")
        toast.success("Password reset successfully!")
      } else {
        // Handle different error types
        if (res.status === 429) {
          toast.error(data.message || `Too many attempts. Please wait ${data.retryAfter || 900} seconds before trying again.`)
        } else if (res.status === 400 && data.error === 'Invalid OTP') {
          toast.error("Invalid or expired verification code. Please check your code or request a new one.")
        } else if (res.status === 404) {
          toast.error("Account not found. Please check your email or phone number.")
        } else {
          toast.error(data.message || "Failed to reset password")
        }
      }
    } catch (error) {
      console.error("Reset password error:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-semibold text-green-700 dark:text-green-400">
              Password Reset Complete!
            </CardTitle>
            <CardDescription className="mt-2">
              Your password has been successfully updated. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Security Tips</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
                    <li>• Keep your password secure and private</li>
                    <li>• Don't share your login credentials</li>
                    <li>• Sign out from public devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/student/login">
                <Button className="w-full">
                  Continue to Sign In
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Reset Your Password</CardTitle>
          <CardDescription className="mt-2">
            Enter the verification code sent to your email/phone and create a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              id="identifier"
              label="Email or Phone Number"
              placeholder="Enter the email or phone you used"
              required
              {...register("identifier")}
              error={errors.identifier?.message}
            />

            <div className="space-y-2">
              <InputField
                id="otp"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                {...register("otp", {
                  onChange: (e) => {
                    // Only allow numbers and auto-format
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    e.target.value = value
                  }
                })}
                error={errors.otp?.message}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to your email or phone. Code expires in 10 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password <span className="text-red-600">*</span>
              </label>
              <PasswordInput
                id="newPassword"
                placeholder="Create a strong password"
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword.message}
                </p>
              )}

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Password strength</span>
                    <span className="font-medium">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password <span className="text-red-600">*</span>
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <Link href="/forgot-password">
                <Button variant="ghost" className="text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forgot Password
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the code?</p>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Request new code
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}