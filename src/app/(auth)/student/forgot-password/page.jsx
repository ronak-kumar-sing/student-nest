"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema } from "@/lib/validation/authSchemas"
import { InputField } from "@/components/forms/InputField"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function onSubmit(values) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        setEmailSent(true)
        toast.success("Password reset instructions sent to your email.")
      } else {
        toast.error("Failed to send reset email. Please try again.")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Check Your Email</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've sent password reset instructions to your email address.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                Try Again
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/student/login" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              id="email"
              label="Email Address"
              required
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              error={errors.email?.message}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/student/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
