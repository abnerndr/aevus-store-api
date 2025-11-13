# Mail Service

This module provides email functionality using **SendGrid** for reliable email delivery.

## Configuration

### 1. SendGrid Setup

1. Create a SendGrid account at [https://sendgrid.com](https://sendgrid.com)
2. Create an API key in your SendGrid dashboard
3. Set up sender authentication (domain or single sender verification)

### 2. Environment Variables

Set the following environment variables:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key-here
MAIL_FROM=your-verified-email@yourdomain.com
MAIL_FROM_NAME=Your App Name

# Other email settings
FRONTEND_URL=http://localhost:3001
```

**Important:** The `MAIL_FROM` email must be verified in your SendGrid account.

## Features

- ✅ Email verification
- ✅ Magic link authentication
- ✅ Password reset
- ✅ Welcome emails
- ✅ Password change notifications
- ✅ Login notifications
- ✅ Two-factor authentication codes
- ✅ Custom email sending
- ✅ Email delivery tracking
- ✅ Professional email templates

## Usage

```typescript
import { MailService } from './mail.service';

// Inject the service
constructor(private mailService: MailService) {}

// Send verification email
await this.mailService.sendVerificationEmail(email, token);

// Send magic link
await this.mailService.sendMagicLink(email, token);

// Send test email
await this.mailService.sendTestEmail('test@example.com');

// Send custom email
await this.mailService.sendCustomEmail(
  'user@example.com',
  'Subject',
  '<h1>HTML Content</h1>',
  'Text content'
);

// Test connection
const isConnected = await this.mailService.testConnection();
```

## Email Templates

All emails use responsive HTML templates with:

- 📱 Mobile-friendly responsive design
- 🎨 Modern gradient designs
- 🔒 Security notices and warnings
- 🎯 Clear call-to-action buttons
- 📝 Fallback text versions
- ⚡ Fast delivery via SendGrid

## Benefits of SendGrid

- **High Deliverability**: Better inbox placement rates
- **Scalability**: Handle high email volumes
- **Analytics**: Email open/click tracking
- **Reliability**: 99.9% uptime SLA
- **Compliance**: GDPR and CAN-SPAM compliant
- **Security**: Enterprise-grade security

## Testing

Test your email configuration:

```typescript
// Test connection
const mailService = new MailService(configService);
const isWorking = await mailService.testConnection();

// Send test email
await mailService.sendTestEmail('your-email@example.com');
```

## Troubleshooting

1. **API Key Issues**: Ensure your SendGrid API key has mail send permissions
2. **Sender Verification**: Verify your sender email in SendGrid dashboard
3. **Rate Limits**: SendGrid has rate limits, check your plan limits
4. **Bounces/Spam**: Monitor your sender reputation in SendGrid analytics
