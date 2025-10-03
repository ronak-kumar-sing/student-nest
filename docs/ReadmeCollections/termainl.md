Error fetching dashboard data: Error: Invalid token
    at verifyToken (src/app/api/dashboard/route.js:21:11)
    at GET (src/app/api/dashboard/route.js:30:27)
  19 |     return decoded;
  20 |   } catch (error) {
> 21 |     throw new Error('Invalid token');
     |           ^
  22 |   }
  23 | }
  24 |
 GET /api/dashboard 401 in 194ms
Error fetching room details: CastError: Cast to ObjectId failed for value "invalid-id" (type string) at path "_id" for model "Room"
    at async GET (src/app/api/rooms/[id]/route.js:22:18)
  20 |
  21 |     // Find room and populate owner information
> 22 |     const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');
     |                  ^
  23 |
  24 |     if (!room) {
  25 |       return NextResponse.json({ {
  stringValue: '"invalid-id"',
  messageFormat: undefined,
  kind: 'ObjectId',
  value: 'invalid-id',
  path: '_id',
  reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
      at async GET (src/app/api/rooms/[id]/route.js:22:18)
    20 |
    21 |     // Find room and populate owner information
  > 22 |     const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');
       |                  ^
    23 |
    24 |     if (!room) {
    25 |       return NextResponse.json({,
  valueType: 'string'
}
 GET /api/rooms/invalid-id 500 in 218ms
Login attempt for: { email: 'invalid@test.com' } Role: undefined
Fallback: Searching all user models...
User not found in any model
 POST /api/auth/login 401 in 312ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
 ✓ Compiled /_not-found in 348ms (237 modules)
 ✓ Compiled in 377ms (237 modules)
 ✓ Compiled in 395ms (237 modules)
 ✓ Compiled in 614ms (237 modules)
 ✓ Compiled in 639ms (237 modules)
 ✓ Compiled in 709ms (237 modules)
 ✓ Compiled in 594ms (237 modules)
 ✓ Compiled in 461ms (237 modules)
 ✓ Compiled in 437ms (237 modules)
 ✓ Compiled in 403ms (237 modules)
 ✓ Compiled in 391ms (237 modules)
 ✓ Compiled in 394ms (237 modules)
 ✓ Compiled in 468ms (237 modules)
 ✓ Compiled in 490ms (237 modules)
 ✓ Compiled in 409ms (237 modules)
 ✓ Compiled in 608ms (237 modules)
 ✓ Compiled in 577ms (237 modules)
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
Login attempt for: { email: 'student1@test.com' } Role: student
 ○ Compiling /api/auth/login ...
Student search result: Found
User found: {
  id: new ObjectId('68df662f77a7bd21b7e7e724'),
  email: 'student1@test.com',
  role: 'Student',
  isActive: true,
  model: 'Student'
}
Password valid, proceeding with login
Login successful for: student1@test.com
 POST /api/auth/login 200 in 1058ms
Login attempt for: { email: 'owner1@test.com' } Role: owner
Owner search result: Found
User found: {
  id: new ObjectId('68df663077a7bd21b7e7e728'),
  email: 'owner1@test.com',
  role: 'Owner',
  isActive: true,
  model: 'Owner'
}
Password valid, proceeding with login
Login successful for: owner1@test.com
 POST /api/auth/login 200 in 590ms
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
 GET /api/rooms?limit=10 200 in 200ms
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
 GET /api/rooms/68df663077a7bd21b7e7e72c 200 in 253ms
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
 GET /api/dashboard 200 in 312ms
 GET /api/dashboard 200 in 140ms
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
 POST /api/bookings 201 in 575ms
 GET /api/rooms/68df663077a7bd21b7e7e72c 200 in 151ms
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
 POST /api/meetings 400 in 309ms
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
 POST /api/reviews 201 in 565ms
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
Error creating room sharing: Error: RoomShare validation failed: costSharing.depositPerPerson: Path `costSharing.depositPerPerson` is required., costSharing.rentPerPerson: Path `costSharing.rentPerPerson` is required., availableFrom: Available from date must be today or in the future, currentParticipants.0.sharedAmount: Path `sharedAmount` is required.
    at POST (src/app/api/room-sharing/route.js:182:13)
  180 |
  181 |   } catch (error) {
> 182 |     console.error('Error creating room sharing:', error);
      |             ^
  183 |
  184 |     if (error.message === 'Invalid token' || error.message === 'No token provided') {
  185 |       return NextResponse.json({ {
  errors: [Object],
  _message: 'RoomShare validation failed'
}
 POST /api/room-sharing 500 in 721ms
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
 GET /api/invalid-endpoint 404 in 1059ms
Error fetching dashboard data: Error: Invalid token
    at verifyToken (src/app/api/dashboard/route.js:21:11)
    at GET (src/app/api/dashboard/route.js:30:27)
  19 |     return decoded;
  20 |   } catch (error) {
> 21 |     throw new Error('Invalid token');
     |           ^
  22 |   }
  23 | }
  24 |
 GET /api/dashboard 401 in 90ms
Error fetching room details: CastError: Cast to ObjectId failed for value "invalid-id" (type string) at path "_id" for model "Room"
    at async GET (src/app/api/rooms/[id]/route.js:22:18)
  20 |
  21 |     // Find room and populate owner information
> 22 |     const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');
     |                  ^
  23 |
  24 |     if (!room) {
  25 |       return NextResponse.json({ {
  stringValue: '"invalid-id"',
  messageFormat: undefined,
  kind: 'ObjectId',
  value: 'invalid-id',
  path: '_id',
  reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
      at async GET (src/app/api/rooms/[id]/route.js:22:18)
    20 |
    21 |     // Find room and populate owner information
  > 22 |     const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');
       |                  ^
    23 |
    24 |     if (!room) {
    25 |       return NextResponse.json({,
  valueType: 'string'
}
 GET /api/rooms/invalid-id 500 in 175ms
Login attempt for: { email: 'invalid@test.com' } Role: undefined
Fallback: Searching all user models...
User not found in any model
 POST /api/auth/login 401 in 185ms
 ⚠ ./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
Module not found: Can't resolve 'drizzle-orm' in '/Users/ronakkumarsingh/Desktop/student-nest/node_modules/rate-limiter-flexible/lib'

Import trace for requested module:
./node_modules/rate-limiter-flexible/lib/RateLimiterDrizzle.js
./node_modules/rate-limiter-flexible/index.js
./src/app/api/auth/login/route.js
Error creating room sharing: Error: Invalid token
    at verifyToken (src/app/api/room-sharing/route.js:19:11)
    at POST (src/app/api/room-sharing/route.js:29:27)
  17 |     return decoded;
  18 |   } catch (error) {
> 19 |     throw new Error('Invalid token');
     |           ^
  20 |   }
  21 | }
  22 |
 POST /api/room-sharing 401 in 141ms
 POST /api/auth/login 400 in 38ms
Error creating room sharing: Error: Invalid token
    at verifyToken (src/app/api/room-sharing/route.js:19:11)
    at POST (src/app/api/room-sharing/route.js:29:27)
  17 |     return decoded;
  18 |   } catch (error) {
> 19 |     throw new Error('Invalid token');
     |           ^
  20 |   }
  21 | }
  22 |
 POST /api/room-sharing 401 in 116ms
 POST /api/auth/login 400 in 54ms
Login attempt for: { email: 'rahul.sharma@student.org' } Role: student
Student search result: Not found
Fallback: Searching all user models...
User not found in any model
 POST /api/auth/login 401 in 231ms
Login attempt for: { email: 'student1@test.com' } Role: student
Student search result: Found
User found: {
  id: new ObjectId('68df662f77a7bd21b7e7e724'),
  email: 'student1@test.com',
  role: 'Student',
  isActive: true,
  model: 'Student'
}
Password valid, proceeding with login
Login successful for: student1@test.com
 POST /api/auth/login 200 in 633ms
 POST /api/auth/login 429 in 35ms

