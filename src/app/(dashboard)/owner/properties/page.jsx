"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Plus,
  Edit,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Star,
  Loader2,
  AlertCircle,
  Power,
  PowerOff,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyProperties();

      if (response.success) {
        setProperties(response.data.properties || []);
      } else {
        throw new Error(response.error || 'Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (propertyId, action) => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties/my-properties', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ propertyId, action })
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state
        setProperties(prev => prev.map(prop =>
          prop._id === propertyId
            ? { ...prop, status: result.data.property.status, availability: result.data.property.availability }
            : prop
        ));
        // Show success message (you can use toast here)
        alert(result.message);
      } else {
        throw new Error(result.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/my-properties?propertyId=${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setProperties(prev => prev.filter(prop => prop._id !== propertyId));
        alert('Property deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (property) => {
    if (property.status === 'inactive') {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (!property.availability?.isAvailable) {
      return <Badge variant="destructive">Unavailable</Badge>;
    }

    const occupancyRate = (property.occupiedRooms / property.totalRooms) * 100;
    if (occupancyRate === 100) {
      return <Badge variant="destructive">Full</Badge>;
    } else if (occupancyRate >= 80) {
      return <Badge variant="secondary">Nearly Full</Badge>;
    } else if (occupancyRate >= 50) {
      return <Badge variant="default">Half Occupied</Badge>;
    } else {
      return <Badge variant="success" className="bg-green-500">Available</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Properties</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadProperties} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">
            Manage your listed properties and track their performance
          </p>
        </div>
        <Button asChild>
          <Link href="/owner/post-property">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">No Properties Listed</h2>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first property listing
            </p>
            <Button asChild>
              <Link href="/owner/post-property">
                <Plus className="h-4 w-4 mr-2" />
                List Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {property.images && property.images.length > 0 && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(property)}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      {property.roomType || property.accommodationType}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">
                    {property.location?.address || property.location?.city || 'Location not specified'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold">₹{property.price?.toLocaleString()}/month</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{property.occupiedRooms || 0}/{property.totalRooms || 1}</span>
                  </div>
                </div>

                {property.averageRating > 0 && (
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{property.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">
                      ({property.totalReviews || 0} reviews)
                    </span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description}
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/rooms/${property._id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="flex gap-2 pt-2">
                  {property.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-orange-600 border-orange-600 hover:bg-orange-50"
                      onClick={() => handlePropertyAction(property._id, 'deactivate')}
                    >
                      <PowerOff className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handlePropertyAction(property._id, 'activate')}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteProperty(property._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
