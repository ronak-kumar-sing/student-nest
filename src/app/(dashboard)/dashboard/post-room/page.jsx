"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  MapPin,
  Home,
  Wifi,
  Car,
  Utensils,
  Shield,
  Dumbbell,
  Shirt,
  Thermometer
} from "lucide-react";
import { useState } from "react";

export default function PostRoomPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: '',
    occupancy: '',
    amenities: []
  });

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'laundry', label: 'Laundry', icon: Shirt },
    { id: 'ac', label: 'Air Conditioning', icon: Thermometer },
  ];

  const handleAmenityChange = (amenityId, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(id => id !== amenityId)
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post New Property</h1>
        <p className="text-muted-foreground mt-2">
          List your property and connect with potential tenants
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide essential details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Spacious PG for Students near IT Park"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, highlighting key features and nearby amenities..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Monthly Rent (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="15000"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="occupancy">Occupancy Type</Label>
                  <select
                    id="occupancy"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    value={formData.occupancy}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupancy: e.target.value }))}
                  >
                    <option value="">Select occupancy</option>
                    <option value="single">Single</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="dormitory">Dormitory</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    className="pl-10"
                    placeholder="Enter complete address"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Select all amenities available at your property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={formData.amenities.includes(amenity.id)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked)}
                    />
                    <Label htmlFor={amenity.id} className="flex items-center gap-2 cursor-pointer">
                      <amenity.icon className="h-4 w-4" />
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                Add high-quality photos of your property (minimum 3 photos required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your images here, or click to browse
                </p>
                <Button variant="outline">Choose Files</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-md"></div>
              <div>
                <h3 className="font-semibold">
                  {formData.title || "Your Property Title"}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {formData.location || "Location"}
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                {formData.price ? `₹${formData.price}/month` : "₹XX,XXX/month"}
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.amenities.slice(0, 3).map((amenityId) => {
                    const amenity = amenitiesList.find(a => a.id === amenityId);
                    return (
                      <Badge key={amenityId} variant="secondary" className="text-xs">
                        {amenity?.label}
                      </Badge>
                    );
                  })}
                  {formData.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{formData.amenities.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Featured Listing (+₹500)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <Label htmlFor="verified">Request Verification</Label>
              </div>
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Publish Listing
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
