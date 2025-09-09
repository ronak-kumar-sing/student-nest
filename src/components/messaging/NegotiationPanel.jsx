"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  X,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react";

export default function NegotiationPanel({
  conversation,
  property,
  onSubmitOffer,
  onClose,
  userType = "student",
  existingNegotiation = null
}) {
  const [offerAmount, setOfferAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const originalPrice = property.rent || 0;
  const currentOffer = existingNegotiation?.amount || 0;
  const savingsAmount = originalPrice - (parseInt(offerAmount) || 0);
  const savingsPercentage = originalPrice > 0 ? ((savingsAmount / originalPrice) * 100).toFixed(1) : 0;

  const handleSubmit = async () => {
    if (!offerAmount || parseInt(offerAmount) <= 0) return;

    setIsSubmitting(true);

    const offerData = {
      amount: parseInt(offerAmount),
      originalPrice: originalPrice,
      terms: terms.trim(),
      moveInDate: moveInDate,
      securityDeposit: securityDeposit ? parseInt(securityDeposit) : property.securityDeposit,
      status: 'pending',
      propertyId: property.id,
      timestamp: new Date().toISOString()
    };

    await onSubmitOffer(offerData);
    setIsSubmitting(false);
    onClose();
  };

  const handleAcceptOffer = async () => {
    if (!existingNegotiation) return;

    setIsSubmitting(true);

    const acceptanceData = {
      ...existingNegotiation,
      status: 'accepted',
      acceptedBy: userType,
      acceptedAt: new Date().toISOString()
    };

    await onSubmitOffer(acceptanceData);
    setIsSubmitting(false);
    onClose();
  };

  const negotiationHistory = existingNegotiation?.history || [];

  return (
    <Card className="mb-4 border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price Negotiation
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Price Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Original Price</div>
            <div className="text-lg font-bold">₹{originalPrice.toLocaleString()}/month</div>
          </div>

          {currentOffer > 0 && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Current Offer</div>
              <div className="text-lg font-bold text-blue-600">₹{currentOffer.toLocaleString()}/month</div>
            </div>
          )}

          {parseInt(offerAmount) > 0 && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Your Offer</div>
              <div className="text-lg font-bold text-green-600">₹{parseInt(offerAmount).toLocaleString()}/month</div>
              {savingsAmount > 0 && (
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Save ₹{savingsAmount.toLocaleString()} ({savingsPercentage}%)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Negotiation Form */}
        {userType === "student" || (userType === "owner" && existingNegotiation) ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {userType === "student" ? "Your Offer" : "Counter Offer"} (₹/month)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  min="1000"
                  max={originalPrice}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Min: ₹1,000 • Max: ₹{originalPrice.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Security Deposit (₹)</label>
                <Input
                  type="number"
                  placeholder={property.securityDeposit?.toString() || "Enter amount"}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Move-in Date</label>
              <Input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Terms (Optional)</label>
              <Textarea
                placeholder="Any specific terms, conditions, or requests..."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {terms.length}/500 characters
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!offerAmount || parseInt(offerAmount) <= 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    {userType === "student" ? "Submit Offer" : "Send Counter Offer"}
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {/* Owner Accept/Reject Actions */}
        {userType === "owner" && existingNegotiation && existingNegotiation.status === "pending" && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Current Student Offer:</h4>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">₹{existingNegotiation.amount.toLocaleString()}/month</span>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
                {existingNegotiation.terms && (
                  <p className="text-sm text-muted-foreground">{existingNegotiation.terms}</p>
                )}
                {existingNegotiation.moveInDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Move-in: {new Date(existingNegotiation.moveInDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptOffer}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Offer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {/* Show counter offer form */ }}
                  className="flex-1"
                >
                  Counter Offer
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Negotiation History */}
        {negotiationHistory.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Negotiation History</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {negotiationHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    <div>
                      <span className="font-medium">₹{item.amount.toLocaleString()}/month</span>
                      <span className="text-muted-foreground ml-2">by {item.submittedBy}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tips */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
            💡 Negotiation Tips
          </h5>
          <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
            {userType === "student" ? (
              <>
                <li>• Research market rates in the area</li>
                <li>• Highlight your positive qualities as a tenant</li>
                <li>• Be reasonable with your offer</li>
                <li>• Consider longer lease terms for better rates</li>
              </>
            ) : (
              <>
                <li>• Consider the student's profile and requirements</li>
                <li>• Factor in market demand and competition</li>
                <li>• Long-term reliable tenants can justify lower rates</li>
                <li>• Be open to reasonable negotiations</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
