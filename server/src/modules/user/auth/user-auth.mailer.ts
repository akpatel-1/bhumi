import resend from '@infra/email/email.js';
import { otpTemplate } from '@infra/email/template/otp-template.js';

export const sendVerificationOtp = async (email: string, otp: number) => {
  await resend.emails.send({
    from: 'Bhumi <onboarding@resend.dev>',
    to: email,
    subject: 'Your Bhumi Verification Code',
    html: otpTemplate(otp),
  });
};
