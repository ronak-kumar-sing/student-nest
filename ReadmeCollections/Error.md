Comparing password...
Password valid: true
 POST /api/auth/login 200 in 2744ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/student 401 in 400ms
 PUT /api/profile/student 401 in 24ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/preferences/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/preferences/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/preferences/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/preferences/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/preferences'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 GET /api/profile/student/preferences 500 in 1365ms
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/preferences/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/preferences/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/preferences/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/preferences/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/preferences'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 PUT /api/profile/student/preferences 500 in 297ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/verification/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/verification/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/verification/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/verification/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/verification/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/verification/route.js:251:553)
    at <unknown> (.next/server/app/api/profile/student/verification/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/verification/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/verification'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/student/verification 500 in 782ms
Login query: {"email":"vikram.patel@gmail.com","role":{"$in":["owner","Owner"]}}
Looking for user with role: owner
Found user: {
  id: new ObjectId('68cec2094ed359cefec4224d'),
  email: 'vikram.patel@gmail.com',
  phone: '+918765432109',
  role: 'Owner',
  isActive: true,
  hasPassword: true
}
Comparing password...
Password valid: true
 POST /api/auth/login 200 in 828ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/owner 401 in 548ms
 PUT /api/profile/owner 401 in 13ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 GET /api/profile/owner/verification 200 in 185ms
 ✓ Compiled /api/profile/owner/verification in 298ms (105 modules)
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
Login query: {"email":"priya.sharma@gmail.com","role":{"$in":["student","Student"]}}
Looking for user with role: student
Found user: {
  id: new ObjectId('68cec2094ed359cefec42247'),
  email: 'priya.sharma@gmail.com',
  phone: '+919876543210',
  role: 'Student',
  isActive: true,
  hasPassword: true
}
Comparing password...
 ○ Compiling /api/auth/login ...
Password valid: true
 POST /api/auth/login 200 in 825ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 GET /api/profile/student 500 in 785ms
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 PUT /api/profile/student 500 in 302ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/preferences/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/preferences/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/preferences/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/preferences/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/preferences'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/student/preferences 500 in 501ms
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/preferences/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/preferences/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/preferences/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/preferences/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/student/preferences/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/preferences/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/preferences'
}
 PUT /api/profile/student/preferences 500 in 253ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Student" already exists
    at eval (src/lib/models/Student.js:132:21)
    at <unknown> (rsc)/./src/lib/models/Student.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/verification/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/student/verification/route.js:10:77)
    at <unknown> (rsc)/./src/app/api/profile/student/verification/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/student/verification/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/student/verification/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/student/verification/route.js:251:553)
    at <unknown> (.next/server/app/api/profile/student/verification/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/student/verification/route.js:254:3)
  130 | });
  131 |
> 132 | export default User.discriminator('Student', studentSchema);
      |                     ^ {
  page: '/api/profile/student/verification'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/student/verification 500 in 459ms
Login query: {"email":"vikram.patel@gmail.com","role":{"$in":["owner","Owner"]}}
Looking for user with role: owner
Found user: {
  id: new ObjectId('68cec2094ed359cefec4224d'),
  email: 'vikram.patel@gmail.com',
  phone: '+918765432109',
  role: 'Owner',
  isActive: true,
  hasPassword: true
}
Comparing password...
Password valid: true
 POST /api/auth/login 200 in 566ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⨯ Error: Discriminator with name "Owner" already exists
    at eval (src/lib/models/Owner.js:207:21)
    at <unknown> (rsc)/./src/lib/models/Owner.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/owner/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/owner/route.js:10:75)
    at <unknown> (rsc)/./src/app/api/profile/owner/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/owner/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/owner/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/owner/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/owner/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/owner/route.js:254:3)
  205 | };
  206 |
> 207 | export default User.discriminator('Owner', ownerSchema);
      |                     ^ {
  page: '/api/profile/owner'
}
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:15269) [MONGOOSE] Warning: Duplicate schema index on {"phone":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 GET /api/profile/owner 500 in 459ms
 ⨯ Error: Discriminator with name "Owner" already exists
    at eval (src/lib/models/Owner.js:207:21)
    at <unknown> (rsc)/./src/lib/models/Owner.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/owner/route.js:76:1)
    at eval (webpack-internal:///(rsc)/./src/app/api/profile/owner/route.js:10:75)
    at <unknown> (rsc)/./src/app/api/profile/owner/route.js (/Users/ronakkumarsingh/Desktop/student-nest/.next/server/app/api/profile/owner/route.js:43:1)
    at __webpack_exec__ (.next/server/app/api/profile/owner/route.js:250:39)
    at <unknown> (.next/server/app/api/profile/owner/route.js:251:573)
    at <unknown> (.next/server/app/api/profile/owner/route.js:251:47)
    at Object.<anonymous> (.next/server/app/api/profile/owner/route.js:254:3)
  205 | };
  206 |
> 207 | export default User.discriminator('Owner', ownerSchema);
      |                     ^ {
  page: '/api/profile/owner'
}
 PUT /api/profile/owner 500 in 253ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 GET /api/profile/owner/verification 200 in 124ms
