"use client"

import { forwardRef, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export const PhoneInputField = forwardRef(({
  id,
  label,
  error,
  required,
  className,
  value,
  onChange,
  onBlur,
  ...props
}, ref) => {
  // Initialize with empty array of 10 digits
  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '', '', ''])

  // Extract digits from the value prop (remove +91 prefix)
  useEffect(() => {
    if (value) {
      const phoneNumber = value.replace(/^\+91/, '')
      const digitArray = phoneNumber.split('').slice(0, 10)
      // Pad with empty strings if needed
      while (digitArray.length < 10) {
        digitArray.push('')
      }
      setDigits(digitArray)
    } else {
      setDigits(['', '', '', '', '', '', '', '', '', ''])
    }
  }, [value])

  const handleDigitChange = (index, newValue) => {
    // Only allow single digits
    if (newValue && !/^\d$/.test(newValue)) return

    const newDigits = [...digits]
    newDigits[index] = newValue

    // Auto-focus to next input if a digit is entered
    if (newValue && index < 9) {
      const nextInput = document.getElementById(`${id}-digit-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    setDigits(newDigits)

    // Build the full phone number with +91 prefix
    const phoneNumber = newDigits.join('')
    const fullValue = phoneNumber ? `+91${phoneNumber}` : ''

    // Call the original onChange
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: fullValue,
          name: id
        }
      }
      onChange(syntheticEvent)
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`${id}-digit-${index - 1}`)
      if (prevInput) prevInput.focus()
    }

    // Handle paste
    if (e.key === 'Enter' || e.key === 'Tab') {
      return // Let default behavior handle these
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10)
    const newDigits = [...digits]

    for (let i = 0; i < pastedData.length && i < 10; i++) {
      newDigits[i] = pastedData[i]
    }

    setDigits(newDigits)

    const phoneNumber = newDigits.join('')
    const fullValue = phoneNumber ? `+91${phoneNumber}` : ''

    if (onChange) {
      const syntheticEvent = {
        target: {
          value: fullValue,
          name: id
        }
      }
      onChange(syntheticEvent)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>
          {label}
        </Label>
      )}

      <div className="space-y-2">
        {/* Country Code Display */}
        <div className="flex items-center gap-2 mb-1">
          <div className="px-2 py-1 bg-muted/50 border border-input rounded text-xs font-medium text-muted-foreground">
            +91
          </div>
          <span className="text-xs text-muted-foreground">India</span>
        </div>

        {/* Phone Number Input Boxes */}
        <div className="flex gap-1 flex-wrap">
          {digits.map((digit, index) => (
            <input
              key={index}
              id={`${id}-digit-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "w-7 h-8 text-center border border-input rounded text-sm font-medium",
                "focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                className
              )}
              placeholder="0"
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

PhoneInputField.displayName = "PhoneInputField"