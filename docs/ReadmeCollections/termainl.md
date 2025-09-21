end Response: {
  success: true,
  message: 'OTP sent to your email successfully',
  data: { email: 'test2@example.com', expiresIn: 300, provider: 'sendgrid' }
}
✅ OTP sent successfully

🔍 Check the server console above for the generated OTP code
📝 The debug output will show: "Code: XXXXXX"

⏳ Waiting 3 seconds for you to note the code...

📋 To test OTP verification manually:
   1. Note the 6-digit code from the server console output above
   2. Use this curl command with the actual code:
   curl -X POST http://localhost:3000/api/otp/email/verify \
        -H "Content-Type: application/json" \
        -d '{"value":"test2@example.com","code":"REPLACE_WITH_ACTUAL_CODE"}'

✅ System is working - just use the correct OTP code!

student-nest on  ronak-backend [✘!?] via  v22.19.0 took 4s
❯ curl -X POST http://localhost:3000/api/otp/email/verify -H "Content-Type:
 application/json" -d '{"value":"test@example.com","code":"747587"}'
{"success":true,"message":"Email verified successfully"}%

student-nest on  ronak-backend [✘!?] via  v22.19.0
❯ npm run dev

> student-nest@0.1.0 dev
> next dev

   ▲ Next.js 15.5.2
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.10:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1824ms
 ○ Compiling /api/otp/phone/send ...
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
✅ MongoDB connected successfully
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 321011
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:46:11.921Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM58cdc8e26a0c809f78d7771877e616d6
 POST /api/otp/phone/send 200 in 3011ms
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 923585
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:47:32.897Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM42960ac80cc296b17d99085853801db4
 POST /api/otp/phone/send 200 in 817ms
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 596901
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:47:33.717Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM20e52606390106ef24a019d54fef089a
 POST /api/otp/phone/send 200 in 1117ms
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 823822
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:47:34.843Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SMb85662d68961d62029ee7cc3eafb9a92
 POST /api/otp/phone/send 200 in 1221ms
 POST /api/otp/phone/send 429 in 23ms
 POST /api/otp/phone/send 429 in 18ms
🔍 Creating OTP:
  - Identifier: +917009097789
  - Type: phone
  - Code: 499986
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:48:13.325Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM9123256b930376cc670f88dc322a1b65
 POST /api/otp/phone/send 200 in 1187ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 675ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 76ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 72ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 71ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 72ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 105ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 109ms
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 577962
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:49:27.059Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM22f88c98aae897e05363e40a791a2df5
 POST /api/otp/phone/send 200 in 833ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 117ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
🔍 Creating OTP:
  - Identifier: test@example.com
  - Type: email
  - Code: 140784
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:49:58.161Z
  - ✅ OTP saved successfully
✅ Email sent via SendGrid to: test@example.com
✅ OTP email sent successfully: sendgrid
 POST /api/otp/email/send 200 in 2753ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/send/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
Email OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/email/verify/route.js:33:49)
  31 |           success: false,
  32 |           error: 'Validation failed',
> 33 |           message: validationResult.error.errors[0].message
     |                                                 ^
  34 |         },
  35 |         { status: 400 }
  36 |       );
 POST /api/otp/email/verify 500 in 546ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 140ms
Email OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/email/verify/route.js:33:49)
  31 |           success: false,
  32 |           error: 'Validation failed',
> 33 |           message: validationResult.error.errors[0].message
     |                                                 ^
  34 |         },
  35 |         { status: 400 }
  36 |       );
 POST /api/otp/email/verify 500 in 91ms
 ✓ Compiled /api/otp/email/verify in 36ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 608ms
 ○ Compiling /api/otp/phone/verify ...
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
🔍 Creating OTP:
  - Identifier: +919876543210
  - Type: phone
  - Code: 147033
  - Purpose: verification
  - ExpiresAt: 2025-09-21T10:53:23.993Z
  - ✅ OTP saved successfully
✅ OTP SMS sent successfully: SM0942396747340cfa26856571e48882ec
 POST /api/otp/phone/send 200 in 1825ms
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 87ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
Email OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/email/verify/route.js:33:49)
  31 |           success: false,
  32 |           error: 'Validation failed',
> 33 |           message: validationResult.error.errors[0].message
     |                                                 ^
  34 |         },
  35 |         { status: 400 }
  36 |       );
 POST /api/otp/email/verify 500 in 265ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 151ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/otp/phone/verify/route.js
Phone OTP verification error: TypeError: Cannot read properties of undefined (reading '0')
    at POST (src/app/api/otp/phone/verify/route.js:59:49)
  57 |           success: false,
  58 |           error: 'Validation failed',
> 59 |           message: validationResult.error.errors[0].message
     |                                                 ^
  60 |         },
  61 |         { status: 400 }
  62 |       );
 POST /api/otp/phone/verify 500 in 149ms
