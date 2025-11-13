import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendPasswordResetDTO } from './dto/send-password-reset.dto';
import { SendTestEmailDTO } from './dto/send-test-email.dto';
import { SendVerificationEmailDTO } from './dto/send-verification-email.dto';
import { MailService } from './mail.service';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test-connection')
  async testConnection() {
    const isConnected = await this.mailService.testConnection();
    return {
      success: isConnected,
      message: isConnected
        ? 'Mail service is connected successfully'
        : 'Mail service connection failed',
    };
  }

  @Post('send-welcome')
  async sendWelcomeEmail(@Body() dto: SendTestEmailDTO) {
    try {
      await this.mailService.sendWelcomeEmail(dto.to, dto.name ?? 'User');
      return {
        success: true,
        message: 'Welcome email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send welcome email',
        error: error.message,
      };
    }
  }

  @Post('send-verification')
  async sendVerificationEmail(@Body() dto: SendVerificationEmailDTO) {
    try {
      await this.mailService.sendVerificationEmail(dto.email, dto.token);
      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send verification email',
        error: error.message,
      };
    }
  }

  @Post('send-password-reset')
  async sendPasswordReset(@Body() dto: SendPasswordResetDTO) {
    try {
      await this.mailService.sendPasswordReset(dto.email, dto.token);
      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send password reset email',
        error: error.message,
      };
    }
  }

  @Post('send-magic-link')
  async sendMagicLink(@Body() dto: SendVerificationEmailDTO) {
    try {
      await this.mailService.sendMagicLink(dto.email, dto.token);
      return {
        success: true,
        message: 'Magic link sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send magic link',
        error: error.message,
      };
    }
  }

  @Post('send-2fa-code')
  async sendTwoFactorCode(@Body() body: { email: string; code: string }) {
    try {
      await this.mailService.sendTwoFactorCode(body.email, body.code);
      return {
        success: true,
        message: 'Two-factor code sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send two-factor code',
        error: error.message,
      };
    }
  }

  @Post('send-test')
  async sendTestEmail(@Body() body: { email: string }) {
    try {
      const result = await this.mailService.sendTestEmail(body.email);
      return {
        success: result,
        message: result ? 'Test email sent successfully via SendGrid' : 'Failed to send test email',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send test email',
        error: error.message,
      };
    }
  }
}
