Here’s a drop‑in README for a modern, accessible authentication UI in Next.js 15+ with Tailwind CSS and shadcn/ui that meets all the listed requirements for students and room owners, including OTP email/phone verification and mandatory DigiLocker/Aadhaar verification for owners.

# Modern Auth UI (Next.js 15 + Tailwind + shadcn/ui)

A production‑ready authentication UI for Student and Room Owner accounts with OTP verification, strong password validation, responsive design, and dark/light themes.

- Student: Login, Sign Up (email + phone OTP), Forgot Password
- Room Owner: Login, Sign Up (email + phone OTP), Mandatory DigiLocker/Aadhaar verification before activation
- Tech: Next.js 15+ (App Router), Tailwind CSS, shadcn/ui, react-hook-form, zod, next-themes
- UX: Clean, minimal, responsive; smooth validation with friendly errors; reusable inputs/buttons/OTP modal; accessible labels and aria attributes

## Features

- Student Authentication
  - Login via username/email + password
  - Sign Up fields: Full Name, Email (OTP), Phone (OTP), Password, College ID, College Name
  - Strong password: min 8 chars, 1 uppercase, 1 number, 1 special character
  - Forgot Password flow (request + reset screens)

- Room Owner Authentication
  - Login via username/email + password
  - Sign Up fields: Full Name, Email (OTP), Phone (OTP), Password
  - Mandatory Verification page after signup:
    - DigiLocker flow (link Aadhaar)
    - Aadhaar Number entry + document upload option
    - Account remains inactive until verification passes

- General
  - Tailwind-based, modern UI with shadcn/ui components
  - Dark + Light mode (system aware) via next-themes
  - Smooth client-side validation (zod) + user-friendly error states
  - Reusable Input, Password, Button, and OTP Modal components
  - Accessible form markup (labels, aria-invalid, aria-describedby, roles)

## Tech Stack

- UI: Next.js 15+, React 19, TypeScript
- Styling: Tailwind CSS, shadcn/ui, class-variance-authority, tailwind-merge
- Forms: react-hook-form, @hookform/resolvers, zod
- Theming: next-themes
- Icons/Feedback: lucide-react, sonner (toasts)

## Directory Structure

```
app/
  (auth)/
    student/
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/[token]/page.tsx
    owner/
      login/page.tsx
      signup/page.tsx
      verify/page.tsx        # DigiLocker/Aadhaar verification
  api/
    auth/
      login/route.ts         # POST login (username/email + password)
      student/signup/route.ts
      owner/signup/route.ts
      forgot-password/route.ts
      reset-password/route.ts
    otp/
      email/send/route.ts
      email/verify/route.ts
      phone/send/route.ts
      phone/verify/route.ts
    verification/
      aadhaar/initiate/route.ts
      aadhaar/verify/route.ts
      digilocker/initiate/route.ts
      digilocker/callback/route.ts
components/
  ui/                        # shadcn-generated components
  forms/
    InputField.tsx
    PasswordInput.tsx
    OtpModal.tsx
  auth/
    StudentLoginForm.tsx
    StudentSignupForm.tsx
    OwnerLoginForm.tsx
    OwnerSignupForm.tsx
    OwnerVerificationForm.tsx
lib/
  validation/
    authSchemas.ts
  utils/
    password.ts
    phone.ts
    fetcher.ts
  providers/
    theme-provider.tsx
styles/
  globals.css
```

## Getting Started

1) Create app (Next.js 15+, TypeScript, Tailwind)
- If starting fresh:
  - npx create-next-app@latest auth-ui
  - Choose TypeScript + Tailwind + App Router
- If existing app: ensure Next.js 15+ and Tailwind installed

2) Install dependencies
```
pnpm add zod react-hook-form @hookform/resolvers next-themes lucide-react class-variance-authority tailwind-merge sonner
```

3) Initialize shadcn/ui
```
npx shadcn@latest init
```

4) Add required shadcn components
```
npx shadcn@latest add button input label form dialog separator sonner input-otp card badge
```

5) Configure Tailwind
- tailwind.config.ts
```
import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
```

- styles/globals.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}
```

6) Theme provider
- lib/providers/theme-provider.tsx
```
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
```

- app/layout.tsx (wrap html/body)
```
import "./../styles/globals.css"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Environment Variables

Create .env.local (UI will call these APIs; use mock mode during UI dev):
```
# Mock mode for local development (UI will call local route handlers)
MOCK_VERIFICATION=true

# OTP/email provider (replace with real service in integration)
EMAIL_FROM="no-reply@studentnest.local"

# Phone OTP provider (stub for UI)
PHONE_OTP_SENDER_ID="STDNST"

# DigiLocker/Aadhaar placeholders (stub)
DIGILOCKER_CLIENT_ID=""
DIGILOCKER_CLIENT_SECRET=""
DIGILOCKER_REDIRECT_URI="http://localhost:3000/api/verification/digilocker/callback"
```

## Validation Rules (zod)

- Email: valid format
- Phone: 10–15 digits (E.164 capable); UI normalizes
- Password: at least 8 chars, includes 1 uppercase, 1 number, 1 special char
- OTP: numeric 6 digits
- Student Sign Up: fullName, email, phone, password, collegeId, collegeName
- Owner Sign Up: fullName, email, phone, password; post‑signup verification required

lib/validation/authSchemas.ts
```
import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character")

export const emailSchema = z.string().email("Enter a valid email")

export const phoneSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, "Enter a valid phone number")

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter 6-digit OTP")

export const studentSignupSchema = z.object({
  fullName: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  collegeId: z.string().min(2, "Required"),
  collegeName: z.string().min(2, "Required"),
})

export const ownerSignupSchema = z.object({
  fullName: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  identifier: z.string().min(2), // username or email
  password: z.string().min(1),
})
```

## Reusable Components

- components/forms/InputField.tsx
```
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "tailwind-merge"

type Props = {
  id: string
  label: string
  type?: string
  error?: string
  className?: string
  required?: boolean
  props?: React.InputHTMLAttributes<HTMLInputElement>
}

export function InputField({ id, label, error, className, required, ...props }: Props) {
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="font-medium">
        {label}
        {required ? <span aria-hidden="true" className="text-red-600"> *</span> : null}
      </Label>
      <Input id={id} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
```

- components/forms/PasswordInput.tsx
```
"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = React.useState(false)
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} autoComplete="new-password" {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1 h-8 w-8"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
```

- components/forms/OtpModal.tsx (uses shadcn Dialog + input-otp)
```
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  channel: "email" | "phone"
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
}

export function OtpModal({ open, onOpenChange, channel, onVerify, onResend }: Props) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleVerify() {
    setLoading(true)
    setError(null)
    try {
      await onVerify(otp)
      onOpenChange(false)
    } catch (e: any) {
      setError(e?.message ?? "Verification failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="otp-desc">
        <DialogHeader>
          <DialogTitle>Verify {channel === "email" ? "Email" : "Phone"}</DialogTitle>
        </DialogHeader>
        <p id="otp-desc" className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your {channel}.
        </p>
        <InputOTP maxLength={6} value={otp} onChange={setOtp} aria-label="One-time password">
          <InputOTPGroup>
            {[0,1,2,3,4,5].map((i) => (<InputOTPSlot key={i} index={i} />))}
          </InputOTPGroup>
        </InputOTP>
        {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResend}>Resend Code</Button>
          <Button onClick={handleVerify} disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Forms (Pages)

- Student Sign Up (app/(auth)/student/signup/page.tsx)
```
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { studentSignupSchema } from "@/lib/validation/authSchemas"
import { z } from "zod"
import { InputField } from "@/components/forms/InputField"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { Button } from "@/components/ui/button"
import { OtpModal } from "@/components/forms/OtpModal"
import { toast } from "sonner"

type FormValues = z.infer<typeof studentSignupSchema>

export default function StudentSignupPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(studentSignupSchema),
  })

  const [emailVerified, setEmailVerified] = React.useState(false)
  const [phoneVerified, setPhoneVerified] = React.useState(false)
  const [otpOpen, setOtpOpen] = React.useState<false | "email" | "phone">(false)

  async function onSubmit(values: FormValues) {
    if (!emailVerified || !phoneVerified) {
      toast.error("Please verify email and phone to continue.")
      return
    }
    const res = await fetch("/api/auth/student/signup", {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (res.ok) {
      toast.success("Account created. You can now log in.")
    } else {
      toast.error("Sign up failed.")
    }
  }

  async function sendOtp(kind: "email" | "phone") {
    const value = kind === "email" ? watch("email") : watch("phone")
    if (!value) return toast.error(`Enter your ${kind} first.`)
    await fetch(`/api/otp/${kind}/send`, { method: "POST", body: JSON.stringify({ value }) })
    setOtpOpen(kind)
    toast.success(`OTP sent to ${kind}.`)
  }

  async function verifyOtp(code: string) {
    if (!otpOpen) return
    const value = otpOpen === "email" ? watch("email") : watch("phone")
    const res = await fetch(`/api/otp/${otpOpen}/verify`, { method: "POST", body: JSON.stringify({ value, code }) })
    if (res.ok) {
      otpOpen === "email" ? setEmailVerified(true) : setPhoneVerified(true)
      toast.success(`${otpOpen} verified.`)
    } else {
      throw new Error("Invalid code.")
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Create Student Account</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField id="fullName" label="Full Name" required {...register("fullName")} error={errors.fullName?.message} />
        <div className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-2">
            <InputField id="email" label="Email" required type="email" {...register("email")} error={errors.email?.message} />
          </div>
          <Button type="button" variant={emailVerified ? "secondary" : "outline"} onClick={() => sendOtp("email")} aria-disabled={emailVerified}>
            {emailVerified ? "Verified" : "Verify Email"}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-2">
            <InputField id="phone" label="Phone" required type="tel" placeholder="+91XXXXXXXXXX" {...register("phone")} error={errors.phone?.message} />
          </div>
          <Button type="button" variant={phoneVerified ? "secondary" : "outline"} onClick={() => sendOtp("phone")} aria-disabled={phoneVerified}>
            {phoneVerified ? "Verified" : "Verify Phone"}
          </Button>
        </div>
        <InputField id="password" label="Create Password" required>
          <PasswordInput {...register("password")} />
        </InputField>
        <InputField id="collegeId" label="College ID" required {...register("collegeId")} error={errors.collegeId?.message} />
        <InputField id="collegeName" label="College Name" required {...register("collegeName")} error={errors.collegeName?.message} />

        <Button type="submit" className="w-full">Sign Up</Button>
      </form>

      <OtpModal
        open={!!otpOpen}
        onOpenChange={(o) => setOtpOpen(o ? otpOpen : false)}
        channel={otpOpen || "email"}
        onVerify={verifyOtp}
        onResend={() => sendOtp(otpOpen || "email")}
      />
    </main>
  )
}
```

- Student Login (app/(auth)/student/login/page.tsx)
  - identifier (username/email) + password + “Forgot Password” link

- Owner Signup/Login: mirror Student forms (without college fields); after owner signup success, redirect to /owner/verify

- Owner Verification (app/(auth)/owner/verify/page.tsx)
  - Aadhaar Number input, Upload Aadhaar (file), “Link via DigiLocker” button
  - Show status badges: Pending → In Review → Verified
  - Disable access to dashboard until verified

## API Contracts (UI Integration)

Note: These are UI-facing contracts. For UI-only demos, keep MOCK_VERIFICATION=true and return stubbed success from route handlers.

- POST /api/auth/login
  - body: { identifier: string; password: string }
  - 200 OK on valid credentials

- POST /api/auth/student/signup
  - body: studentSignupSchema
  - requires prior OTP verification for email & phone

- POST /api/auth/owner/signup
  - body: ownerSignupSchema
  - response should include nextStep: "verification"

- POST /api/otp/email/send | /api/otp/phone/send
  - body: { value: string }

- POST /api/otp/email/verify | /api/otp/phone/verify
  - body: { value: string; code: string }
  - 200 OK if valid

- POST /api/verification/aadhaar/initiate
  - body: { aadhaarNumber: string } → 202 Accepted

- POST /api/verification/aadhaar/verify
  - body: { aadhaarNumber: string, fileId?: string } → 200 Verified/Pending

- GET /api/verification/digilocker/initiate → 302 to DigiLocker
- GET /api/verification/digilocker/callback?code=... → sets verification status

## UI Stubs (Mock Mode)

- app/api/otp/email/verify/route.ts (stub example)
```
export async function POST(req: Request) {
  const { code } = await req.json()
  return code === "123456" ? Response.json({ ok: true }) : new Response("Invalid code", { status: 400 })
}
```

- app/api/verification/aadhaar/verify/route.ts (stub)
```
export async function POST() {
  return Response.json({ status: "verified" })
}
```

Use 123456 as the demo OTP in mock mode.

## Accessibility

- Every input paired with a Label (htmlFor) and descriptive error via aria-describedby
- aria-invalid set on fields with errors
- Buttons with clear labels; icon-only buttons have aria-label
- Modal traps focus; ESC closes; proper Dialog roles
- Live feedback via role="alert" or toast notifications

## Theming & Responsiveness

- next-themes for class-based dark mode
- Semantic color tokens from shadcn/ui; ensure contrast AA+
- Mobile-first layout; forms max-w-md; grid for Verify buttons
- States: hover, focus-visible, disabled provided by shadcn & Tailwind

## Toasts and Errors

- sonner toaster for async results: sent OTP, verified, errors
- Friendly messages, avoid exposing internal error codes
- Disable submit while pending; show “Verifying…” states

## Best Practices

- Validate at input (zod) and re-validate on submit
- Never rely solely on client-side OTP checks (server must verify); UI demonstrates flow with mocks
- Owner accounts must be flagged inactive until verification success
- Rate-limit OTP sends (UI shows cooldown timer if desired)

## Scripts

- Dev: pnpm dev
- Build: pnpm build
- Lint: pnpm lint
- Typecheck: pnpm typecheck

## Suggested Enhancements

- Add resend cooldown timer and attempt limit in OtpModal
- Add password strength meter and guidelines tooltip
- Add international phone input with country picker
- Add “continue as owner/student” tabs toggle on auth pages
- Replace mock APIs with real services (email/SMS provider, DigiLocker sandbox)

## Testing

- Unit (Vitest): zod schemas, utility functions
- E2E (Playwright): student signup with OTP → login; owner signup → verification gate
- Accessibility: @axe-core/react in dev, lighthouse CI for contrast and semantics

## Notes

- This repository focuses on the UI and developer experience; security-critical verification and session handling must be implemented server-side before production use.
- If using a provider-based auth (e.g., NextAuth), adapt login POST to provider flow, but keep the same UI and validation.

## License

MIT. Replace or include third-party licenses (icons, fonts) as needed.

***

If a downloadable starter is needed, this README can be bundled with a minimal repo that includes the scaffolding, mock routes, and the listed components. Since there’s currently no access to external tooling in this environment, the starter code is outlined above with copy‑pasteable snippets and exact dependency lists for immediate setup.

[1](https://nextjs.org/docs/pages/guides/authentication)
[2](https://buttercms.com/blog/nextjs-authentication-tutorial/)
[3](https://www.youtube.com/watch?v=n-fVrzaikBQ)
[4](https://nextjs.org/learn/dashboard-app/adding-authentication)
[5](https://www.youtube.com/watch?v=yoiBv0K6_1U)
[6](https://www.loginradius.com/blog/engineering/guest-post/nextjs-authentication-guide)
[7](https://frontegg.com/blog/next-js-authentication)
[8](https://strapi.io/blog/epic-next-js-15-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
[9](https://www.freecodecamp.org/news/how-to-authenticate-users-with-nextauth-in-nextjs-app-and-pages-router/)