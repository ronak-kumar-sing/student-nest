"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/forms/InputField"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, Mail, Phone } from "lucide-react"

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required")
})

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const identifier = watch("identifier")

  async function onSubmit(values) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (res.ok) {
        setEmailSent(true)
        toast.success("Instructions sent!")
      } else {
        // Handle rate limiting specifically
        if (res.status === 429) {
          toast.error(data.message || `Too many attempts. Try again in ${data.retryAfter || 900} seconds.`)
        } else {
          toast.error(data.message || "Failed to send reset instructions")
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-semibold">Check Your {identifier?.includes("@") ? "Email" : "Phone"}</CardTitle>
            <CardDescription className="mt-2">
              If an account with {identifier?.includes("@") ? "this email" : "this phone number"} exists,
              you will receive {identifier?.includes("@") ? "an email" : "an SMS"} with a 6-digit password reset code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">⏰ Code expires in 10 minutes</p>
                <p className="text-blue-700 dark:text-blue-300 text-xs">Use the code as soon as you receive it.</p>
              </div>

              <div>
                <p className="mb-2">Didn't receive anything? Check your:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {identifier?.includes("@") ? (
                    <>
                      <li>Spam/junk folder</li>
                      <li>Email address spelling</li>
                      <li>Account existence</li>
                    </>
                  ) : (
                    <>
                      <li>Phone number accuracy</li>
                      <li>SMS messages</li>
                      <li>Account existence</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/reset-password">
                <Button className="w-full">
                  Enter Reset Code
                </Button>
              </Link>

              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Try Different {identifier?.includes("@") ? "Email" : "Phone Number"}
              </Button>

              <Link href="/student/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
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
          <CardTitle className="text-2xl font-semibold">Forgot Password?</CardTitle>
          <CardDescription className="mt-2">
            Enter your email address or phone number and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <InputField
                id="identifier"
                label="Email or Phone Number"
                placeholder="Enter your email or phone number"
                required
                {...register("identifier")}
                error={errors.identifier?.message}
                icon={identifier?.includes("@") ? Mail : Phone}
              />
              <p className="text-xs text-muted-foreground">
                We'll send reset instructions to your registered email or phone number.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending Instructions..." : "Send Reset Instructions"}
            </Button>

            <div className="text-center">
              <Link href="/student/login">
                <Button variant="ghost" className="text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an account?</p>
              <div className="flex justify-center gap-2 mt-1">
                <Link href="/student/signup" className="text-blue-600 hover:underline">
                  Student Sign Up
                </Link>
                <span>|</span>
                <Link href="/owner/signup" className="text-green-600 hover:underline">
                  Owner Sign Up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}