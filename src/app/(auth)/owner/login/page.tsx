"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validation/authSchemas"
import { InputField } from "@/components/forms/InputField"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { DemoCredentials } from "@/components/auth/DemoCredentials"

export default function OwnerLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/bookings'
      router.push(redirectPath)
    }
  }, [isAuthenticated, authLoading, router])

  async function onSubmit(values: { identifier: string; password: string }) {
    setLoading(true)

    try {
      const result = await login(values.identifier, values.password, 'owner', rememberMe)

      if (result.success && result.user) {
        const user = result.user as any // Owner type with verification

        // Handle different verification states
        if (user.verification?.status === "pending") {
          toast.info("Please complete your verification process.")
          router.replace("/verification")
        } else if (user.verification?.status === "verified" || user.isActive) {
          toast.success(`Welcome back, ${user.fullName || user.email}!`)
          const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/bookings'
          router.replace(redirectPath)
        } else {
          toast.warning("Your account is under review. Please wait for verification.")
          setLoading(false)
        }
      } else {
        toast.error(result.error || "Login failed. Please check your credentials.")
        setLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Network error. Please try again.")
      setLoading(false)
    }
    // Don't set loading to false on success redirect
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
          {/* Demo Credentials Component */}
          <DemoCredentials type="owner" />

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
              id="identifier"
              label="Username or Email"
              required
              {...register("identifier")}
              error={errors.identifier?.message as string}
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
                <p className="text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Stay logged in for a week
                </label>
              </div>

              <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading || authLoading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
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
