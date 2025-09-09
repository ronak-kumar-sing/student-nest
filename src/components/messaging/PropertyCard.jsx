"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Utensils,
  DollarSign,
  Eye,
  Heart
} from "lucide-react";

export default function PropertyCard({
  property,
  onClose,
  onNegotiate,
  onViewDetails,
  onSaveProperty
}) {
  const [isSaved, setIsSaved] = useState(property.isSaved || false);

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'parking':
        return <Car className="h-3 w-3" />;
      case 'food':
      case 'meals':
        return <Utensils className="h-3 w-3" />;
      default:
        return <div className="h-3 w-3 bg-muted rounded-full" />;
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveProperty?.(property.id, !isSaved);
  };

  return (
    <Card className="mb-4 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {property.name}
              {property.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {property.location}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Image */}
          <div className="relative">
            <img
              src={property.images?.[0] || '/placeholder-property.jpg'}
              alt={property.name}
              className="w-full h-24 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background"
              onClick={handleSave}
            >
              <Heart className={`h-3 w-3 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Property Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-primary">
                ₹{property.rent?.toLocaleString()}/month
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{property.rating}</span>
                <span className="text-muted-foreground">({property.reviews})</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {property.occupancy}
              </div>
              <div>
                {property.roomType}
              </div>
              {property.availableFrom && (
                <div>
                  Available from {new Date(property.availableFrom).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getAmenityIcon(amenity)}
                    <span className="ml-1">{amenity}</span>
                  </Badge>
                ))}
                {property.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.amenities.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails?.(property.id)}
                className="flex-1 min-w-fit"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>

              <Button
                size="sm"
                onClick={onNegotiate}
                className="flex-1 min-w-fit"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Negotiate Price
              </Button>
            </div>

            {/* Special Offers */}
            {property.specialOffer && (
              <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-700 dark:text-green-400">
                🎉 {property.specialOffer}
              </div>
            )}
          </div>
        </div>

        {/* Additional Property Info */}
        {property.description && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {property.description}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-3 grid grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="text-sm font-medium">{property.totalRooms || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Total Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">{property.availableRooms || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">
              {property.securityDeposit ? `₹${property.securityDeposit.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">Security Deposit</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
