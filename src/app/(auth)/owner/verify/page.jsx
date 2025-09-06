"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { aadhaarVerificationSchema } from "@/lib/validation/authSchemas"
import { InputField } from "@/components/forms/InputField"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function OwnerVerifyPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(aadhaarVerificationSchema),
  })

  const [verificationStatus, setVerificationStatus] = useState("pending") // pending, in-review, verified, rejected
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  async function onSubmitAadhaar(values) {
    setLoading(true)
    try {
      const res = await fetch("/api/verification/aadhaar/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        setVerificationStatus("in-review")
        toast.success("Aadhaar verification initiated. We'll review your details.")
      } else {
        toast.error("Verification failed. Please try again.")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDigiLocker() {
    try {
      const res = await fetch("/api/verification/digilocker/initiate")
      const data = await res.json()

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        toast.error("DigiLocker integration temporarily unavailable.")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB")
        return
      }
      if (!file.type.includes("image") && !file.type.includes("pdf")) {
        toast.error("Please upload an image or PDF file")
        return
      }
      setUploadedFile(file)
      toast.success("File uploaded successfully")
    }
  }

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>
      case "in-review":
        return <Badge variant="default" className="gap-1"><AlertCircle className="w-3 h-3" />In Review</Badge>
      case "verified":
        return <Badge variant="success" className="gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Verified</Badge>
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Rejected</Badge>
      default:
        return null
    }
  }

  if (verificationStatus === "verified") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Verification Complete!</h1>
            <p className="text-gray-600 mb-4">
              Your account has been verified. You can now list your properties.
            </p>
            <Button onClick={() => window.location.href = "/owner/dashboard"} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Identity Verification
          </CardTitle>
          <CardDescription>
            Complete your verification to activate your owner account
          </CardDescription>
          <div className="flex justify-center mt-2">
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationStatus === "pending" && (
            <>
              {/* DigiLocker Option */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Option 1: DigiLocker (Recommended)
                </h3>
                <p className="text-sm text-gray-600">
                  Instantly verify your identity using DigiLocker. This is the fastest method.
                </p>
                <Button onClick={handleDigiLocker} className="w-full" variant="default">
                  Link via DigiLocker
                </Button>
              </div>

              <Separator />

              {/* Manual Aadhaar Option */}
              <div className="space-y-4">
                <h3 className="font-semibold">Option 2: Manual Aadhaar Verification</h3>
                <form onSubmit={handleSubmit(onSubmitAadhaar)} className="space-y-4">
                  <InputField
                    id="aadhaarNumber"
                    label="Aadhaar Number"
                    required
                    placeholder="Enter 12-digit Aadhaar number"
                    {...register("aadhaarNumber")}
                    error={errors.aadhaarNumber?.message}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Upload Aadhaar Document (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadedFile && (
                      <p className="text-sm text-green-600">✓ {uploadedFile.name} uploaded</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload a clear photo or scan of your Aadhaar card (front side). Max 5MB.
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Submitting..." : "Submit for Verification"}
                  </Button>
                </form>
              </div>
            </>
          )}

          {verificationStatus === "in-review" && (
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-blue-500 mx-auto" />
              <h3 className="text-lg font-semibold">Verification in Progress</h3>
              <p className="text-gray-600">
                We're reviewing your documents. This usually takes 1-2 business days.
                We'll notify you via email once the verification is complete.
              </p>
              <Button variant="outline" onClick={() => window.location.href = "/owner/login"}>
                Back to Login
              </Button>
            </div>
          )}

          {verificationStatus === "rejected" && (
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold">Verification Failed</h3>
              <p className="text-gray-600">
                Your verification was rejected. Please check your details and try again.
              </p>
              <Button onClick={() => setVerificationStatus("pending")} className="w-full">
                Try Again
              </Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Why do we need verification?</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Ensure safety and trust for students</li>
              <li>• Comply with legal requirements</li>
              <li>• Prevent fraudulent listings</li>
              <li>• Build a secure marketplace</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
