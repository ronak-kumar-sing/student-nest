"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, User, Clock, Sparkles, Users, Utensils, Music, DoorOpen } from 'lucide-react';

const assessmentSchema = z.object({
  sleepSchedule: z.enum(['early', 'night', 'flexible'], {
    required_error: "Please select your sleep schedule"
  }),
  cleanliness: z.enum(['high', 'moderate', 'relaxed'], {
    required_error: "Please select your cleanliness preference"
  }),
  studyHabits: z.enum(['silent', 'quiet', 'social'], {
    required_error: "Please select your study habits"
  }),
  socialLevel: z.enum(['introvert', 'moderate', 'extrovert'], {
    required_error: "Please select your social level"
  }),
  cookingFrequency: z.enum(['never', 'rarely', 'often', 'daily'], {
    required_error: "Please select your cooking frequency"
  }),
  musicPreference: z.enum(['silent', 'quiet', 'moderate', 'loud'], {
    required_error: "Please select your music preference"
  }),
  guestPolicy: z.enum(['none', 'rare', 'occasional', 'frequent'], {
    required_error: "Please select your guest policy"
  }),
  additionalNotes: z.string().optional()
});

const assessmentQuestions = [
  {
    key: 'sleepSchedule',
    label: 'Sleep Schedule',
    icon: Clock,
    description: 'When do you usually sleep and wake up?',
    options: [
      { value: 'early', label: 'Early Bird (Sleep by 10 PM, Wake by 7 AM)' },
      { value: 'night', label: 'Night Owl (Sleep after 12 AM, Wake after 9 AM)' },
      { value: 'flexible', label: 'Flexible (Varies by day)' }
    ]
  },
  {
    key: 'cleanliness',
    label: 'Cleanliness Standards',
    icon: Sparkles,
    description: 'How important is cleanliness to you?',
    options: [
      { value: 'high', label: 'Very Important (Daily cleaning, organized)' },
      { value: 'moderate', label: 'Moderately Important (Regular cleaning)' },
      { value: 'relaxed', label: 'Relaxed (Clean when needed)' }
    ]
  },
  {
    key: 'studyHabits',
    label: 'Study Environment',
    icon: User,
    description: 'What study environment do you prefer?',
    options: [
      { value: 'silent', label: 'Complete Silence' },
      { value: 'quiet', label: 'Quiet Background' },
      { value: 'social', label: 'Can Study with Background Activity' }
    ]
  },
  {
    key: 'socialLevel',
    label: 'Social Interaction',
    icon: Users,
    description: 'How social are you at home?',
    options: [
      { value: 'introvert', label: 'Prefer Privacy (Minimal interaction)' },
      { value: 'moderate', label: 'Balanced (Some interaction)' },
      { value: 'extrovert', label: 'Very Social (Love to interact)' }
    ]
  },
  {
    key: 'cookingFrequency',
    label: 'Cooking Habits',
    icon: Utensils,
    description: 'How often do you cook?',
    options: [
      { value: 'never', label: 'Never (Order food/Mess)' },
      { value: 'rarely', label: 'Rarely (1-2 times/week)' },
      { value: 'often', label: 'Often (3-5 times/week)' },
      { value: 'daily', label: 'Daily Cooking' }
    ]
  },
  {
    key: 'musicPreference',
    label: 'Music & Noise',
    icon: Music,
    description: 'What is your preference for music/noise levels?',
    options: [
      { value: 'silent', label: 'Complete Silence' },
      { value: 'quiet', label: 'Low Volume Only' },
      { value: 'moderate', label: 'Moderate Volume OK' },
      { value: 'loud', label: 'Don\'t Mind Loud Music' }
    ]
  },
  {
    key: 'guestPolicy',
    label: 'Guests & Visitors',
    icon: DoorOpen,
    description: 'How do you feel about roommate guests?',
    options: [
      { value: 'none', label: 'No Guests Preferred' },
      { value: 'rare', label: 'Very Rarely (Special occasions)' },
      { value: 'occasional', label: 'Occasionally (With notice)' },
      { value: 'frequent', label: 'Frequent Guests OK' }
    ]
  }
];

export function RoomShareAssessment({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = "Room Sharing Compatibility Assessment",
  description = "Help us find you the most compatible roommates by answering a few quick questions."
}) {
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      additionalNotes: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = assessmentQuestions.length;

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(data);
      setCurrentStep(0);
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canGoNext = () => {
    const currentQuestion = assessmentQuestions[currentStep];
    const currentValue = watch(currentQuestion.key);
    return !!currentValue;
  };

  const currentQuestion = assessmentQuestions[currentStep];
  const Icon = currentQuestion.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Current question */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {currentQuestion.label}
              </Label>
              <p className="text-sm text-gray-600 mt-1">{currentQuestion.description}</p>
            </div>

            <Controller
              name={currentQuestion.key}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="border-2"
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />

            {errors[currentQuestion.key] && (
              <p className="text-sm text-red-600">{errors[currentQuestion.key].message}</p>
            )}
          </div>

          {/* Additional notes on last step */}
          {currentStep === totalSteps - 1 && (
            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-sm font-medium">
                Additional Notes (Optional)
              </Label>
              <Controller
                name="additionalNotes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="additionalNotes"
                    placeholder="Any other preferences or requirements you'd like to mention?"
                    className="min-h-[100px]"
                  />
                )}
              />
            </div>
          )}

          {/* Navigation buttons */}
          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canGoNext()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !canGoNext()}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Assessment
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoomShareAssessment;