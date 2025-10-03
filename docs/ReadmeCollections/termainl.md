## Error Type
Console TypeError

## Error Message
Cannot read properties of undefined (reading 'getBookings')


    at fetchBookings (src/app/(dashboard)/dashboard/bookings/page.jsx:21:30)
    at button (<anonymous>:null:null)
    at BookingsPage (src/app/(dashboard)/dashboard/bookings/page.jsx:115:13)

## Code Frame
  19 |     try {
  20 |       setLoading(true);
> 21 |       const response = await apiClient.getBookings();
     |                              ^
  22 |
  23 |       if (response.success) {
  24 |         setBookings(response.data || []);

Next.js version: 15.5.2 (Webpack)
