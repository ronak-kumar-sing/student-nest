'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { Calendar, MapPin, Clock, CreditCard, FileText, Eye, X, DollarSign, AlertTriangle } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBookings();

      if (response.success) {
        // Extract bookings array from response.data.bookings
        const bookingsData = response.data?.bookings || [];
        // Ensure all bookings have valid structure
        const validBookings = bookingsData.filter(booking =>
          booking && typeof booking === 'object' && (booking._id || booking.id)
        );
        setBookings(validBookings);
      } else {
        setError(response.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewRoom = (roomId) => {
    router.push(`/dashboard/rooms/${roomId}`);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await apiClient.updateBooking(bookingId, {
        status: 'cancelled'
      });

      if (response.success) {
        await fetchBookings(); // Refresh the list
        alert('Booking cancelled successfully');
      } else {
        alert(response.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.message || 'Failed to cancel booking');
    }
  };

  const handlePayment = async (booking) => {
    try {
      // Handle both financial nested structure and flat structure
      const paymentAmount = booking.financial?.totalAmount || booking.totalAmount || 0;
      const monthlyRent = booking.financial?.monthlyRent || booking.monthlyRent || 0;
      const securityDeposit = booking.financial?.securityDeposit || booking.securityDeposit || 0;
      const maintenanceCharges = booking.financial?.maintenanceCharges || booking.maintenanceCharges || 0;

      const confirmed = confirm(`Confirm payment of ₹${paymentAmount.toLocaleString()} for this booking?\n\nThis includes:\n- Monthly Rent: ₹${monthlyRent.toLocaleString()}\n- Security Deposit: ₹${securityDeposit.toLocaleString()}\n- Maintenance: ₹${maintenanceCharges.toLocaleString()}`);

      if (!confirmed) return;

      // Process payment using the payment API
      const response = await apiClient.processPayment(booking.id, paymentAmount, 'card');

      if (response.success) {
        await fetchBookings(); // Refresh the list
        alert('🎉 Payment successful! Your booking is now confirmed. You will receive a confirmation email shortly.');
      } else {
        alert(response.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const isBookingExpired = (booking) => {
    const createdAt = new Date(booking.timeline?.createdAt || booking.createdAt);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return booking.status?.toLowerCase() === 'pending' &&
      booking.financial?.paymentStatus !== 'paid' &&
      createdAt < twoDaysAgo;
  };

  const getTimeRemaining = (booking) => {
    const createdAt = new Date(booking.timeline?.createdAt || booking.createdAt);
    const expiryTime = new Date(createdAt.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days from creation
    const now = new Date();

    if (now >= expiryTime) return 'Expired';

    const remaining = expiryTime - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Bookings</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your room bookings and track their status
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any room bookings yet. Start by browsing available rooms.
            </p>
            <button
              onClick={() => router.push('/dashboard/rooms')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id || booking._id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.room?.title || 'Room Booking'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Location */}
                      {booking.room?.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {booking.room.location.address ||
                              booking.room.location.fullAddress ||
                              (booking.room.location.city && booking.room.location.state ?
                                `${booking.room.location.city}, ${booking.room.location.state}` :
                                'Location not specified')}
                          </span>
                        </div>
                      )}

                      {/* Move-in Date */}
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Move-in: {formatDate(booking.schedule?.moveInDate || booking.moveInDate)}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Duration: {booking.schedule?.duration || booking.duration} months
                        </span>
                      </div>

                      {/* Price */}
                      {(booking.room?.pricing?.rent || booking.room?.price) && (
                        <div className="flex items-center text-gray-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            ₹{(booking.room.pricing?.rent || booking.room.price).toLocaleString()}/month
                          </span>
                        </div>
                      )}

                      {/* Agreement Type */}
                      <div className="flex items-center text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        <span className="text-sm capitalize">
                          {booking.schedule?.agreementType || booking.agreementType || 'Monthly'} Agreement
                        </span>
                      </div>

                      {/* Booking Date */}
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Booked: {formatDate(booking.timeline?.createdAt || booking.createdAt)}
                        </span>
                      </div>

                      {/* Payment Status */}
                      {(booking.financial || booking.totalAmount) && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Payment: {(booking.financial?.paymentStatus || booking.paymentStatus) === 'paid' ? 'Paid' : 'Pending'}
                            {(booking.financial?.totalAmount || booking.totalAmount) && ` - ₹${(booking.financial?.totalAmount || booking.totalAmount).toLocaleString()}`}
                          </span>
                        </div>
                      )}

                      {/* Payment Deadline */}
                      {booking.status?.toLowerCase() === 'pending' &&
                        (booking.financial?.paymentStatus || booking.paymentStatus) !== 'paid' && (
                          <div className="flex items-center text-orange-600">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              {getTimeRemaining(booking)}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Notes */}
                    {/* Payment Warning */}
                    {booking.status?.toLowerCase() === 'pending' &&
                      (booking.financial?.paymentStatus || booking.paymentStatus) !== 'paid' && (
                        <div className={`mt-4 p-3 rounded-lg ${isBookingExpired(booking) ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                          <p className={`text-sm font-medium ${isBookingExpired(booking) ? 'text-red-800' : 'text-orange-800'}`}>
                            {isBookingExpired(booking)
                              ? '⚠️ This booking has expired and will be removed soon!'
                              : `💰 Complete payment within ${getTimeRemaining(booking)} to confirm your booking.`
                            }
                          </p>
                        </div>
                      )}

                    {/* Notes */}
                    {(booking.notes?.student || booking.notes) && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {typeof booking.notes === 'string' ? booking.notes : booking.notes?.student || 'No notes'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row lg:flex-col gap-2">
                    <button
                      onClick={() => handleViewRoom(booking.room?.id || booking.roomId)}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Room
                    </button>

                    {/* Payment Button */}
                    {booking.status?.toLowerCase() === 'pending' &&
                      (booking.financial?.paymentStatus || booking.paymentStatus) !== 'paid' &&
                      !isBookingExpired(booking) && (
                        <button
                          onClick={() => handlePayment(booking)}
                          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </button>
                      )}

                    {/* Cancel Button */}
                    {booking.status?.toLowerCase() === 'pending' && !isBookingExpired(booking) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id || booking._id)}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}