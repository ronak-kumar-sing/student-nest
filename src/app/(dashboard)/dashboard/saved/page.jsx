import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star, Users, Wifi, Car, Utensils } from "lucide-react";

export default function SavedPage() {
  const savedProperties = [
    {
      id: 1,
      name: "Sunshine PG for Girls",
      location: "Koramangala, Bangalore",
      price: "₹12,000/month",
      rating: 4.5,
      reviews: 23,
      image: "/properties/sunshine-pg.jpg",
      amenities: ["WiFi", "Food", "AC", "Parking"],
      occupancy: "Single/Double",
      verified: true,
    },
    {
      id: 2,
      name: "Green Valley Hostel",
      location: "HSR Layout, Bangalore",
      price: "₹8,500/month",
      rating: 4.2,
      reviews: 15,
      image: "/properties/green-valley.jpg",
      amenities: ["WiFi", "Food", "Gym", "Laundry"],
      occupancy: "Triple Sharing",
      verified: true,
    },
    {
      id: 3,
      name: "City Center PG",
      location: "MG Road, Bangalore",
      price: "₹15,000/month",
      rating: 4.7,
      reviews: 31,
      image: "/properties/city-center.jpg",
      amenities: ["WiFi", "Food", "AC", "Security"],
      occupancy: "Single",
      verified: false,
    },
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'food':
        return <Utensils className="h-3 w-3" />;
      case 'parking':
        return <Car className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className="text-muted-foreground mt-2">
          Your bookmarked accommodations - {savedProperties.length} properties saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {savedProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"></div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
              {property.verified && (
                <Badge className="absolute top-2 left-2 bg-green-500">
                  Verified
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-green-600">
                    {property.price}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-sm text-muted-foreground">({property.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {property.occupancy}
                </div>

                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      <span className="mr-1">{getAmenityIcon(amenity)}</span>
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.amenities.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {savedProperties.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring and save properties you're interested in
            </p>
            <Button>Browse Properties</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
