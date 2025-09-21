import { NextResponse } from 'next/server';
import { checkTwilioHealth } from '@/lib/twilio';

// GET /api/health/services - Check service health
export async function GET(request) {
  const health = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    // Check Twilio health
    const twilioHealth = await checkTwilioHealth();
    health.services.twilio = {
      status: twilioHealth.healthy ? 'healthy' : 'unhealthy',
      configured: !!process.env.TWILIO_ACCOUNT_SID,
      error: twilioHealth.error || null
    };

    // Check Email service health
    if (process.env.EMAIL_SERVICE === 'sendgrid') {
      health.services.email = {
        status: process.env.SENDGRID_API_KEY ? 'configured' : 'not_configured',
        provider: 'sendgrid',
        configured: !!process.env.SENDGRID_API_KEY
      };
    } else if (process.env.EMAIL_SERVICE === 'gmail') {
      health.services.email = {
        status: (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ? 'configured' : 'not_configured',
        provider: 'gmail',
        configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
      };
    } else {
      health.services.email = {
        status: 'mock',
        provider: 'mock',
        configured: true
      };
    }

    // Check Phone service health
    if (process.env.PHONE_SERVICE === 'twilio') {
      health.services.phone = {
        status: health.services.twilio.status,
        provider: 'twilio',
        configured: health.services.twilio.configured
      };
    } else {
      health.services.phone = {
        status: 'mock',
        provider: 'mock',
        configured: true
      };
    }

    // Check Database connection
    try {
      // This is a simple check - in production you might want to ping the database
      health.services.database = {
        status: process.env.MONGODB_URI ? 'configured' : 'not_configured',
        configured: !!process.env.MONGODB_URI
      };
    } catch (error) {
      health.services.database = {
        status: 'unhealthy',
        configured: !!process.env.MONGODB_URI,
        error: error.message
      };
    }

    // Overall health status
    const allServicesHealthy = Object.values(health.services).every(
      service => service.status === 'healthy' || service.status === 'configured' || service.status === 'mock'
    );

    health.overall = allServicesHealthy ? 'healthy' : 'degraded';

    // Return appropriate status code
    const statusCode = allServicesHealthy ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: 'unhealthy',
      error: 'Health check failed',
      details: error.message
    }, { status: 503 });
  }
}

// POST /api/health/services - Test service functionality
export async function POST(request) {
  try {
    const { service, action } = await request.json();

    switch (service) {
      case 'email':
        if (action === 'test') {
          const testEmail = process.env.TEST_EMAIL || 'test@example.com';
          // Here you would send a test email
          return NextResponse.json({
            success: true,
            message: `Test email would be sent to ${testEmail}`,
            timestamp: new Date().toISOString()
          });
        }
        break;

      case 'sms':
        if (action === 'test') {
          const testPhone = process.env.TEST_PHONE || '+1234567890';
          // Here you would send a test SMS
          return NextResponse.json({
            success: true,
            message: `Test SMS would be sent to ${testPhone}`,
            timestamp: new Date().toISOString()
          });
        }
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid service or action',
          availableServices: ['email', 'sms'],
          availableActions: ['test']
        }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Action not implemented'
    }, { status: 400 });

  } catch (error) {
    console.error('Service test error:', error);

    return NextResponse.json({
      success: false,
      error: 'Service test failed',
      details: error.message
    }, { status: 500 });
  }
}