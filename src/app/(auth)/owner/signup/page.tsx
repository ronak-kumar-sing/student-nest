"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ownerSignupSchema } from "@/lib/validation/authSchemas"
import { InputField } from "@/components/forms/InputField"
import { PhoneInputField } from "@/components/forms/PhoneInputField"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { Button } from "@/components/ui/button"
import { OtpModal } from "@/components/forms/OtpModal"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function OwnerSignupPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(ownerSignupSchema),
  })

  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpChannel, setOtpChannel] = useState<"email" | "phone">("email")
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: any) {
    if (!emailVerified || !phoneVerified) {
      toast.error("Please verify your email and phone number to continue.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/owner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Account created successfully! Welcome to Student Nest!")

        // Store user data and tokens
        if (data.success && data.user) {
          localStorage.setItem("token", data.accessToken)
          localStorage.setItem("user", JSON.stringify({
            ...data.user,
            userType: 'owner'
          }))
        }

        // Check if verification is required
        if (data.nextStep === 'verification') {
          toast.info("Please complete verification to activate all features.")
          router.push("/verification")
        } else {
          // Redirect to dashboard
          router.push("/dashboard")
        }
      } else {
        toast.error(data.error || "Sign up failed. Please try again.")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function sendOtp(kind: "email" | "phone") {
    const value = kind === "email" ? watch("email") : watch("phone")
    if (!value) {
      toast.error(`Please enter your ${kind} first.`)
      return
    }

    try {
      const res = await fetch(`/api/otp/${kind}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
      })

      if (res.ok) {
        setOtpChannel(kind)
        setOtpOpen(true)
        toast.success(`OTP sent to your ${kind}.`)
      } else {
        const data = await res.json()
        toast.error(data.message || `Failed to send OTP to ${kind}.`)
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    }
  }

  async function verifyOtp(code: string) {
    const value = otpChannel === "email" ? watch("email") : watch("phone")
    const res = await fetch(`/api/otp/${otpChannel}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, code })
    })

    if (res.ok) {
      if (otpChannel === "email") {
        setEmailVerified(true)
        toast.success("Email verified successfully!")
      } else {
        setPhoneVerified(true)
        toast.success("Phone verified successfully!")
      }
    } else {
      throw new Error("Invalid OTP code.")
    }
  }

  async function resendOtp() {
    await sendOtp(otpChannel)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Create Owner Account</CardTitle>
          <CardDescription>
            List your properties on Student Nest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              id="fullName"
              label="Full Name"
              required
              {...register("fullName")}
              error={errors.fullName?.message as string}
            />

            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputField
                    id="email"
                    label="Email"
                    required
                    type="email"
                    {...register("email")}
                    error={errors.email?.message as string}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant={emailVerified ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => sendOtp("email")}
                    disabled={emailVerified}
                    className="whitespace-nowrap"
                  >
                    {emailVerified ? (
                      <>
                        <Badge variant="secondary" className="mr-1">✓</Badge>
                        Verified
                      </>
                    ) : "Verify"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <PhoneInputField
                    id="phone"
                    label="Phone"
                    required
                    {...register("phone")}
                    error={errors.phone?.message as string}
                  />
                </div>
                <Button
                  type="button"
                  variant={phoneVerified ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => sendOtp("phone")}
                  disabled={phoneVerified}
                  className="whitespace-nowrap h-8 px-3"
                >
                  {phoneVerified ? (
                    <>
                      <Badge variant="secondary" className="mr-1">✓</Badge>
                      Verified
                    </>
                  ) : "Verify"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Create Password <span className="text-red-600">*</span>
              </label>
              <PasswordInput
                id="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> After signup, you&apos;ll need to verify your identity with Aadhaar/DigiLocker before you can list properties.
            </p>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/owner/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <OtpModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        channel={otpChannel}
        onVerify={verifyOtp}
        onResend={resendOtp}
      />
    </div>
  )
}
