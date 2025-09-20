"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validation/authSchemas"
import { InputField } from "@/components/forms/InputField"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function OwnerLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(values) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: "owner" }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const user = {
          ...data.user,
          userType: data.user.role.toLowerCase()
        }

        if (data.user.verification?.status === "pending") {
          toast.info("Please complete your verification process.")
          localStorage.setItem("token", data.accessToken)
          localStorage.setItem("user", JSON.stringify(user))
          window.location.href = "/owner/verify"
        } else if (data.user.verification?.status === "verified" || data.user.isActive) {
          toast.success("Welcome back!")
          localStorage.setItem("token", data.accessToken)
          localStorage.setItem("user", JSON.stringify(user))
          window.location.href = "/dashboard"
        } else {
          toast.warning("Your account is under review. Please wait for verification.")
        }
      } else {
        toast.error(data.message || data.error || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Owner Login</CardTitle>
          <CardDescription>
            Welcome back! Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Test Credentials */}
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Test Credentials:</p>
            <p className="text-xs text-green-600 dark:text-green-300">Email: vikram.patel@gmail.com</p>
            <p className="text-xs text-green-600 dark:text-green-300">Password: Owner123!</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              id="identifier"
              label="Username or Email"
              required
              {...register("identifier")}
              error={errors.identifier?.message}
            />

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-red-600">*</span>
              </label>
              <PasswordInput
                id="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="/owner/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/owner/signup" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/student/login" className="text-sm text-gray-600 hover:underline">
              Are you a student? Click here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
