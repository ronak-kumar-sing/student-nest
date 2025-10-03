'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Upload,
  MapPin,
  Home,
  Users,
  IndianRupee,
  Wifi,
  Car,
  Utensils,
  Shield,
  Dumbbell,
  Shirt,
  Thermometer,
  Tv,
  Coffee,
  Fan,
  Bed,
  Bath,
  CheckCircle,
  X,
  Plus,
  Camera,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit
} from 'lucide-react';

export default function PostNewPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',

    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',

    // Room Details
    totalRooms: 1,
    availableRooms: 1,
    occupancyType: 'single', // single, shared, both
    roomSize: '',
    bathroomType: 'attached', // attached, shared, common

    // Pricing
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: '',
    electricityCharges: 'included', // included, extra

    // Amenities
    amenities: [],

    // Rules
    rules: [],

    // Images
    images: [],

    // Contact
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    availableFrom: '',

    // Additional
    furnishingStatus: 'furnished', // furnished, semi-furnished, unfurnished
    preferredTenants: 'any', // students, professionals, family, any
    gender: 'any' // male, female, any
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Property details & location' },
    { id: 2, title: 'Room Details', description: 'Room configuration & pricing' },
    { id: 3, title: 'Amenities', description: 'Facilities & features' },
    { id: 4, title: 'Images & Rules', description: 'Photos & house rules' },
    { id: 5, title: 'Review', description: 'Confirm & publish' }
  ];

  const propertyTypes = [
    { value: 'pg', label: 'PG (Paying Guest)', description: 'Shared accommodation with meals' },
    { value: 'hostel', label: 'Hostel', description: 'Budget accommodation for students' },
    { value: 'apartment', label: 'Apartment', description: 'Independent flat or apartment' },
    { value: 'house', label: 'House', description: 'Independent house' },
    { value: 'room', label: 'Room', description: 'Single room in shared property' }
  ];

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: Wifi, category: 'basic' },
    { id: 'food', label: 'Food/Meals', icon: Utensils, category: 'basic' },
    { id: 'parking', label: 'Parking', icon: Car, category: 'basic' },
    { id: 'security', label: '24/7 Security', icon: Shield, category: 'safety' },
    { id: 'cctv', label: 'CCTV Surveillance', icon: Eye, category: 'safety' },
    { id: 'gym', label: 'Gym/Fitness', icon: Dumbbell, category: 'recreation' },
    { id: 'laundry', label: 'Laundry Service', icon: Shirt, category: 'basic' },
    { id: 'ac', label: 'Air Conditioning', icon: Thermometer, category: 'comfort' },
    { id: 'tv', label: 'TV/Cable', icon: Tv, category: 'entertainment' },
    { id: 'fridge', label: 'Refrigerator', icon: Coffee, category: 'kitchen' },
    { id: 'fan', label: 'Ceiling Fan', icon: Fan, category: 'basic' },
    { id: 'bed', label: 'Furnished Bed', icon: Bed, category: 'furniture' },
    { id: 'attached_bathroom', label: 'Attached Bathroom', icon: Bath, category: 'basic' }
  ];

  const commonRules = [
    'No smoking inside the property',
    'No loud music after 10 PM',
    'Visitors allowed with prior notice',
    'No pets allowed',
    'Maintain cleanliness in common areas',
    'No alcohol consumption',
    'Gate closes at 11 PM',
    'Monthly payment in advance'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleRuleToggle = (rule) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.includes(rule)
        ? prev.rules.filter(r => r !== rule)
        : [...prev.rules, rule]
    }));
  };

  const handleImageUpload = async (files) => {
    if (files.length === 0) return;

    setImageLoading(true);
    try {
      // Mock image upload - replace with actual upload logic
      const newImages = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));

      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.propertyType && formData.address && formData.city;
      case 2:
        return formData.monthlyRent && formData.securityDeposit && formData.totalRooms;
      case 3:
        return formData.amenities.length > 0;
      case 4:
        return formData.images.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields');
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await apiClient.postProperty(formData);

      if (result.success) {
        toast.success(result.message || 'Property posted successfully!');

        // Show success details
        setTimeout(() => {
          toast.info('Redirecting to your properties...');
          window.location.href = '/owner/properties';
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to post property');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Comfortable PG for Students near XYZ College"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, facilities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Property Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {propertyTypes.map((type) => (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all ${formData.propertyType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:border-gray-300'
                          }`}
                        onClick={() => handleInputChange('propertyType', type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Home className="w-5 h-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address with building name, street, area..."
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Bengaluru"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Karnataka"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 560001"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g., Near ABC Metro Station"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Room Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalRooms">Total Rooms *</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    min="1"
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange('totalRooms', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="availableRooms">Available Rooms *</Label>
                  <Input
                    id="availableRooms"
                    type="number"
                    min="1"
                    max={formData.totalRooms}
                    value={formData.availableRooms}
                    onChange={(e) => handleInputChange('availableRooms', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="roomSize">Room Size (sq ft)</Label>
                  <Input
                    id="roomSize"
                    placeholder="e.g., 150"
                    value={formData.roomSize}
                    onChange={(e) => handleInputChange('roomSize', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Occupancy Type</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { value: 'single', label: 'Single' },
                      { value: 'shared', label: 'Shared' },
                      { value: 'both', label: 'Both Options' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="occupancyType"
                          value={option.value}
                          checked={formData.occupancyType === option.value}
                          onChange={(e) => handleInputChange('occupancyType', e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Bathroom Type</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { value: 'attached', label: 'Attached' },
                      { value: 'shared', label: 'Shared' },
                      { value: 'common', label: 'Common' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="bathroomType"
                          value={option.value}
                          checked={formData.bathroomType === option.value}
                          onChange={(e) => handleInputChange('bathroomType', e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Pricing Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="e.g., 8000"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    placeholder="e.g., 15000"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="maintenanceCharges">Maintenance Charges (₹)</Label>
                  <Input
                    id="maintenanceCharges"
                    type="number"
                    placeholder="e.g., 1000 (or 0 if included)"
                    value={formData.maintenanceCharges}
                    onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Electricity Charges</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { value: 'included', label: 'Included in rent' },
                      { value: 'extra', label: 'Extra as per usage' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="electricityCharges"
                          value={option.value}
                          checked={formData.electricityCharges === option.value}
                          onChange={(e) => handleInputChange('electricityCharges', e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Amenities</h3>
              <p className="text-gray-600 mb-6">Select all amenities available at your property</p>

              {['basic', 'safety', 'comfort', 'entertainment', 'kitchen', 'furniture', 'recreation'].map((category) => {
                const categoryAmenities = amenitiesList.filter(a => a.category === category);
                if (categoryAmenities.length === 0) return null;

                return (
                  <div key={category} className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">{category} Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categoryAmenities.map((amenity) => {
                        const Icon = amenity.icon;
                        const isSelected = formData.amenities.includes(amenity.id);

                        return (
                          <Card
                            key={amenity.id}
                            className={`cursor-pointer transition-all ${isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:border-gray-300'
                              }`}
                            onClick={() => handleAmenityToggle(amenity.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`} />
                                <span className="text-sm font-medium">{amenity.label}</span>
                                {isSelected && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {formData.amenities.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Selected Amenities ({formData.amenities.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenityId) => {
                      const amenity = amenitiesList.find(a => a.id === amenityId);
                      return amenity ? (
                        <Badge key={amenityId} variant="secondary" className="text-xs">
                          {amenity.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Property Images
              </h3>
              <p className="text-gray-600 mb-4">Upload clear photos of your property. Good images attract more tenants!</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />

                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Upload Property Photos</h4>
                <p className="text-gray-600 mb-4">Drag & drop images or click to browse</p>

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className="mb-2"
                >
                  {imageLoading ? 'Uploading...' : 'Choose Images'}
                </Button>

                <p className="text-xs text-gray-500">
                  Supported: JPG, PNG, WebP (Max 5MB each)
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Uploaded Images ({formData.images.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={image.preview}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">House Rules & Preferences</h3>

              <div className="space-y-4">
                <div>
                  <Label>Common Rules (Select applicable ones)</Label>
                  <div className="mt-2 space-y-2">
                    {commonRules.map((rule, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rules.includes(rule)}
                          onChange={(e) => handleRuleToggle(rule)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{rule}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Tenants</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        { value: 'students', label: 'Students only' },
                        { value: 'professionals', label: 'Working professionals' },
                        { value: 'family', label: 'Families' },
                        { value: 'any', label: 'Anyone welcome' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredTenants"
                            value={option.value}
                            checked={formData.preferredTenants === option.value}
                            onChange={(e) => handleInputChange('preferredTenants', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Gender Preference</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        { value: 'male', label: 'Male only' },
                        { value: 'female', label: 'Female only' },
                        { value: 'any', label: 'No preference' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review Your Property Listing</h3>
              <p className="text-gray-600">Please review all the details before publishing your property</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><span className="font-medium">Title:</span> {formData.title}</div>
                  <div><span className="font-medium">Type:</span> {propertyTypes.find(t => t.value === formData.propertyType)?.label}</div>
                  <div><span className="font-medium">Location:</span> {formData.city}, {formData.state}</div>
                  <div><span className="font-medium">Address:</span> {formData.address}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Room & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><span className="font-medium">Total Rooms:</span> {formData.totalRooms}</div>
                  <div><span className="font-medium">Available:</span> {formData.availableRooms}</div>
                  <div><span className="font-medium">Monthly Rent:</span> ₹{formData.monthlyRent}</div>
                  <div><span className="font-medium">Security Deposit:</span> ₹{formData.securityDeposit}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Amenities ({formData.amenities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {formData.amenities.map((amenityId) => {
                      const amenity = amenitiesList.find(a => a.id === amenityId);
                      return amenity ? (
                        <Badge key={amenityId} variant="outline" className="text-xs">
                          {amenity.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Images & Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><span className="font-medium">Images:</span> {formData.images.length} uploaded</div>
                  <div><span className="font-medium">Rules:</span> {formData.rules.length} selected</div>
                  <div><span className="font-medium">Preferred Tenants:</span> {formData.preferredTenants}</div>
                </CardContent>
              </Card>
            </div>

            {formData.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {formData.images.slice(0, 10).map((image) => (
                      <div key={image.id} className="aspect-square rounded overflow-hidden">
                        <img
                          src={image.preview}
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {formData.images.length > 10 && (
                      <div className="aspect-square rounded bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{formData.images.length - 10} more</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Ready to Publish?</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Your property will be visible to thousands of potential tenants immediately after publishing.
              </p>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Publishing...' : 'Publish Property'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Post New Property
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              List your property and connect with potential tenants
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}