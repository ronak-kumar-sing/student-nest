## Error Type
Console Error

## Error Message
Forbidden


    at ApiClient.request (src/lib/api.js:57:15)
    at async fetchSettings (src/app/(dashboard)/student/profile/settings/page.jsx:61:24)

## Code Frame
  55 |
  56 |       if (!response.ok) {
> 57 |         throw new Error(data.error || `HTTP error! status: ${response.status}`);
     |               ^
  58 |       }
  59 |
  60 |       return data;

Next.js version: 15.5.2 (Webpack)
