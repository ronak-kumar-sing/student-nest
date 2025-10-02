ules)
 GET /student/profile/verification 200 in 5727ms
 ⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
 ○ Compiling /api/verify/requirements ...
 ✓ Compiled /api/verify/requirements in 2.3s (1065 modules)
=== VERIFY REQUIREMENTS: Processing request ===
 GET /student/profile/verification 200 in 652ms
✅ MongoDB connected successfully
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 4499ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 207ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 172ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 157ms
 ✓ Compiled in 5.1s (1065 modules)
 GET /student/profile/verification 200 in 358ms
 ○ Compiling /student/profile ...
 ⚠ ./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx

./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx
 GET /student/profile 200 in 2731ms
 ⚠ ./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx

./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx
 ⚠ ./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx

./src/app/(dashboard)/student/profile/page.jsx
Attempted import error: 'uploadAvatar' is not exported from '@/lib/api' (imported as 'uploadAvatar').

Import trace for requested module:
./src/app/(dashboard)/student/profile/page.jsx
=== VERIFY REQUIREMENTS: Processing request ===
 GET /api/profile/student 200 in 789ms
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 900ms
 GET /api/profile/student 200 in 124ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 166ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 155ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 161ms
=== VERIFY REQUIREMENTS: Processing request ===
✅ User authenticated: {
  id: new ObjectId('68de20315a135dd8dfb03732'),
  email: 'ronakkumar20062006@gmail.com',
  role: 'Student',
  isIdentityVerified: false
}
Verification record: Found
Verification status check error: TypeError: Cannot read properties of undefined (reading 'filter')
    at GET (src/app/api/verify/requirements/route.js:81:46)
  79 |         verification: verification ? {
  80 |           status: verification.status,
> 81 |           completedSteps: verification.steps.filter(step => step.status === 'completed').map(step => step.type),
     |                                              ^
  82 |           pendingSteps: verification.steps.filter(step => step.status === 'pending').map(step => step.type),
  83 |           lastUpdated: verification.updatedAt
  84 |         } : null,
 GET /api/verify/requirements 500 in 157ms
