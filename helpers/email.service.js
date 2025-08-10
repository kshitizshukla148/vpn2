import { sendMail } from '../models/emailTemplates.model.js';

export async function sendOTPEmail(email, otp) {
  return sendMail({
    to: email,
    templateType: 'otp_verification',
    variables: { otp }
  });
}
