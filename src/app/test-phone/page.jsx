import { PhoneInputField } from "@/components/forms/PhoneInputField"
import { Button } from "@/components/ui/button"

export default function TestPhonePage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Phone Input Test</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <PhoneInputField
                id="test-phone"
                label="Phone Number"
                required
                placeholder="Enter phone number"
              />
            </div>
            <Button size="sm" className="h-8 px-3">Verify Phone</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Inline Verify Button Layout:</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Verify button on same line as phone input</li>
            <li>✅ Button aligned with input boxes bottom</li>
            <li>✅ All 10 boxes in single line</li>
            <li>✅ Minimal width (7x8) for compact fit</li>
            <li>✅ Responsive flex layout</li>
            <li>✅ Fixed +91 country code</li>
            <li>✅ Auto-focus to next box</li>
            <li>✅ Backspace navigation</li>
            <li>✅ Paste support</li>
            <li>✅ Only numeric input</li>
          </ul>
        </div>

        <Button className="w-full">Test Submit</Button>
      </div>
    </div>
  )
}