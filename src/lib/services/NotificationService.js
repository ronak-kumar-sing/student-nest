import { sendMeetingNotificationEmail, sendVerificationStatusEmail } from '@/lib/utils/email';
import { sendMeetingNotificationSMS, sendVerificationStatusSMS } from '@/lib/utils/sms';

// Notification service for sending SMS and Email notifications
class NotificationService {

  /**
   * Send meeting request notification to property owner
   */
  static async sendMeetingRequest(ownerEmail, ownerPhone, data) {
    const promises = [];

    try {
      // Send email notification
      if (ownerEmail) {
        promises.push(
          sendMeetingNotificationEmail(ownerEmail, 'request', data)
        );
      }

      // Send SMS notification
      if (ownerPhone) {
        promises.push(
          sendMeetingNotificationSMS(ownerPhone, 'request', data)
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Meeting request notifications sent');
    } catch (error) {
      console.error('❌ Error sending meeting request notifications:', error);
    }
  }

  /**
   * Send meeting confirmation notification to student
   */
  static async sendMeetingConfirmation(studentEmail, studentPhone, data) {
    const promises = [];

    try {
      // Send email notification
      if (studentEmail) {
        promises.push(
          sendMeetingNotificationEmail(studentEmail, 'confirmed', data)
        );
      }

      // Send SMS notification
      if (studentPhone) {
        promises.push(
          sendMeetingNotificationSMS(studentPhone, 'confirmed', data)
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Meeting confirmation notifications sent');
    } catch (error) {
      console.error('❌ Error sending meeting confirmation notifications:', error);
    }
  }

  /**
   * Send meeting cancellation notification
   */
  static async sendMeetingCancellation(userEmail, userPhone, data) {
    const promises = [];

    try {
      // Send email notification
      if (userEmail) {
        promises.push(
          sendMeetingNotificationEmail(userEmail, 'cancelled', data)
        );
      }

      // Send SMS notification
      if (userPhone) {
        promises.push(
          sendMeetingNotificationSMS(userPhone, 'cancelled', data)
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Meeting cancellation notifications sent');
    } catch (error) {
      console.error('❌ Error sending meeting cancellation notifications:', error);
    }
  }

  /**
   * Send verification status update notification
   */
  static async sendVerificationStatusUpdate(userEmail, userPhone, status, fullName) {
    const promises = [];

    try {
      // Send email notification
      if (userEmail) {
        promises.push(
          sendVerificationStatusEmail(userEmail, status, fullName)
        );
      }

      // Send SMS notification
      if (userPhone) {
        promises.push(
          sendVerificationStatusSMS(userPhone, status)
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Verification status notifications sent');
    } catch (error) {
      console.error('❌ Error sending verification status notifications:', error);
    }
  }

  /**
   * Send property inquiry notification to owner
   */
  static async sendPropertyInquiry(ownerEmail, ownerPhone, data) {
    const emailData = {
      studentName: data.studentName,
      propertyName: data.propertyName,
      inquiryMessage: data.message,
      studentContact: data.studentContact
    };

    const smsMessage = `New inquiry from ${data.studentName} for ${data.propertyName}. Check your dashboard for details.`;

    const promises = [];

    try {
      // Send email notification
      if (ownerEmail) {
        promises.push(
          sendMeetingNotificationEmail(ownerEmail, 'inquiry', emailData)
        );
      }

      // Send SMS notification
      if (ownerPhone) {
        promises.push(
          sendMeetingNotificationSMS(ownerPhone, 'inquiry', { message: smsMessage })
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Property inquiry notifications sent');
    } catch (error) {
      console.error('❌ Error sending property inquiry notifications:', error);
    }
  }

  /**
   * Send booking confirmation notification
   */
  static async sendBookingConfirmation(userEmail, userPhone, data) {
    const emailData = {
      propertyName: data.propertyName,
      ownerName: data.ownerName,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      totalAmount: data.totalAmount,
      bookingId: data.bookingId
    };

    const smsMessage = `Booking confirmed for ${data.propertyName}. Booking ID: ${data.bookingId}. Check your dashboard for details.`;

    const promises = [];

    try {
      // Send email notification
      if (userEmail) {
        promises.push(
          sendMeetingNotificationEmail(userEmail, 'booking', emailData)
        );
      }

      // Send SMS notification
      if (userPhone) {
        promises.push(
          sendMeetingNotificationSMS(userPhone, 'booking', { message: smsMessage })
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Booking confirmation notifications sent');
    } catch (error) {
      console.error('❌ Error sending booking confirmation notifications:', error);
    }
  }

  /**
   * Send payment confirmation notification
   */
  static async sendPaymentConfirmation(userEmail, userPhone, data) {
    const emailData = {
      amount: data.amount,
      paymentId: data.paymentId,
      propertyName: data.propertyName,
      paymentDate: data.paymentDate
    };

    const smsMessage = `Payment of ₹${data.amount} confirmed for ${data.propertyName}. Payment ID: ${data.paymentId}`;

    const promises = [];

    try {
      // Send email notification
      if (userEmail) {
        promises.push(
          sendMeetingNotificationEmail(userEmail, 'payment', emailData)
        );
      }

      // Send SMS notification
      if (userPhone) {
        promises.push(
          sendMeetingNotificationSMS(userPhone, 'payment', { message: smsMessage })
        );
      }

      await Promise.allSettled(promises);
      console.log('✅ Payment confirmation notifications sent');
    } catch (error) {
      console.error('❌ Error sending payment confirmation notifications:', error);
    }
  }

  /**
   * Send bulk notification to multiple users
   */
  static async sendBulkNotification(users, type, data) {
    const promises = [];

    users.forEach(user => {
      if (user.email) {
        promises.push(
          sendMeetingNotificationEmail(user.email, type, data)
        );
      }
      if (user.phone) {
        promises.push(
          sendMeetingNotificationSMS(user.phone, type, data)
        );
      }
    });

    try {
      await Promise.allSettled(promises);
      console.log(`✅ Bulk ${type} notifications sent to ${users.length} users`);
    } catch (error) {
      console.error(`❌ Error sending bulk ${type} notifications:`, error);
    }
  }

  /**
   * Send notification based on user preferences
   */
  static async sendNotificationWithPreferences(user, type, data) {
    const promises = [];

    // Check user notification preferences
    const emailEnabled = user.settings?.emailNotifications !== false;
    const smsEnabled = user.settings?.smsNotifications !== false;

    try {
      // Send email if enabled
      if (emailEnabled && user.email) {
        promises.push(
          sendMeetingNotificationEmail(user.email, type, data)
        );
      }

      // Send SMS if enabled
      if (smsEnabled && user.phone) {
        promises.push(
          sendMeetingNotificationSMS(user.phone, type, data)
        );
      }

      await Promise.allSettled(promises);
      console.log(`✅ ${type} notifications sent to ${user.fullName}`);
    } catch (error) {
      console.error(`❌ Error sending ${type} notifications to ${user.fullName}:`, error);
    }
  }
}

export default NotificationService;