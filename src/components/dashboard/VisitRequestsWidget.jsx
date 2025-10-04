"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Edit2
} from 'lucide-react';
import RescheduleModal from '@/components/dashboard/RescheduleModal';

export default function VisitRequestsWidget({ visitRequests, onRefresh }) {
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed
  const [showAll, setShowAll] = useState(false);

  const handleReschedule = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (!visitRequests) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visit Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No visit data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredVisits = visitRequests.visits?.filter(visit => {
    if (filter === 'all') return true;
    return visit.status === filter;
  }) || [];

  const displayedVisits = showAll ? filteredVisits : filteredVisits.slice(0, 5);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', color: 'text-yellow-600', label: 'Pending' },
      confirmed: { variant: 'default', color: 'text-blue-600', label: 'Confirmed' },
      completed: { variant: 'success', color: 'text-green-600', label: 'Completed' },
      cancelled: { variant: 'destructive', color: 'text-red-600', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return 'Not set';
    return new Date(time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visit Requests
            <Badge variant="outline" className="ml-2">
              {visitRequests.total || 0}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All ({visitRequests.total || 0})</option>
              <option value="pending">Pending ({visitRequests.pending || 0})</option>
              <option value="confirmed">Confirmed ({visitRequests.confirmed || 0})</option>
              <option value="completed">Completed ({visitRequests.completed || 0})</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            {visitRequests.pending || 0} pending
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            {visitRequests.confirmed || 0} confirmed
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-green-500" />
            {visitRequests.completed || 0} completed
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {displayedVisits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No {filter === 'all' ? '' : filter} visit requests</p>
            </div>
          ) : (
            displayedVisits.map((visit) => (
              <div key={visit.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{visit.studentName}</span>
                      {getStatusBadge(visit.status)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{visit.propertyTitle}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Requested on {formatDate(visit.requestDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {visit.studentPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{visit.studentPhone}</span>
                    </div>
                  )}
                  {visit.studentEmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{visit.studentEmail}</span>
                    </div>
                  )}
                </div>

                {/* Visit Details */}
                {visit.status === 'confirmed' && visit.confirmedDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Confirmed for {formatDate(visit.confirmedDate)} at {formatTime(visit.confirmedTime)}
                      </span>
                    </div>
                  </div>
                )}

                {visit.notes && (
                  <div className="text-sm text-muted-foreground italic mb-3 pl-4 border-l-2 border-muted">
                    "{visit.notes}"
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {visit.status === 'pending' && (
                    <>
                      <Button size="sm" variant="default" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                  {visit.status === 'confirmed' && (
                    <RescheduleModal
                      meetingId={visit.id}
                      currentDate={visit.confirmedDate}
                      currentTime={visit.confirmedTime}
                      onReschedule={handleReschedule}
                      trigger={
                        <Button size="sm" variant="outline" className="w-full">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                      }
                    />
                  )}
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}

          {/* Show More/Less Button */}
          {filteredVisits.length > 5 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show ${filteredVisits.length - 5} More`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}