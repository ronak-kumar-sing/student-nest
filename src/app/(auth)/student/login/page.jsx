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

export default function StudentLoginPage() {
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
        body: JSON.stringify({ ...values, role: "student" }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("Welcome back!")
        // Store token and user data, then redirect to dashboard
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("user", JSON.stringify({
          ...data.user,
          userType: data.user.role.toLowerCase()
        }))
        window.location.href = "/dashboard"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Student Login</CardTitle>
          <CardDescription>
            Welcome back! Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Test Credentials */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Test Credentials:</p>
            <p className="text-xs text-blue-600 dark:text-blue-300">Email: priya.sharma@gmail.com</p>
            <p className="text-xs text-blue-600 dark:text-blue-300">Password: NewPassword123!</p>
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
              <Link href="/student/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/student/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/owner/login" className="text-sm text-gray-600 hover:underline">
              Are you a room owner? Click here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
