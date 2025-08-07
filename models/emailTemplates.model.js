import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import { getActiveMailServer } from './mail.server.model.js';


//  Email Template Schema
const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // e.g., "Welcome Email", "Password Reset"
  },
  type: {
    type: String,
    required: true,
    unique: true // e.g., "register", "forgot_password"
  },
  subject: {
    type: String,
    required: true   // e.g., "Congratulations register", "Congratulations forgot_password"
  },
  msg_body: {
    type: String, // HTML or text content with {{placeholders}}
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Auto-update `updatedAt` before saving
emailTemplateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const EmailTemplate = mongoose.model('email_templates', emailTemplateSchema);

/**
 * Replace placeholders in template with provided variables
 * @param {string} template  The raw template string
 * @param {object} variables Key-value map of placeholders to values
 * @returns {string} Parsed HTML/text
 */
const parseTemplate = (template, variables = {}) => {
  return Object.keys(variables).reduce((result, key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, variables[key]);
  }, template);
};

/**
 * Send an email using active mail server and a stored template
 * @param {object} emailData { to, templateType, variables }
 */
const sendMail = async (emailData) => {
  try {
    const mailServer = await getActiveMailServer();
    if (!mailServer) {
      console.error('❌ No active mail server found.');
      return;
    }
    const template = await EmailTemplate.findOne({ type: emailData.templateType, status: true });
    if (!template) {
      console.error(`❌ No active email template found for key: "${emailData.templateType}"`);
      return;
    }

    const tos = emailData.to;
    if (!tos) {
      console.error('❌ No recipient email address provided.');
      return;
    }

    const subject = template.subject;
    const body = parseTemplate(template.msg_body, emailData.variables); // Note: you used 'variables' but the `emailData` object has `variables`
      let secure = false;
      let requireTLS = false;

      if (mailServer.encryption === 'ssl' || mailServer.encryption === 2) {
        secure = true;         // SSL on port 465
      } else if (mailServer.encryption === 'tls' || mailServer.encryption === 1) {
        requireTLS = true;     // TLS on port 587
      }

    const transporter = nodemailer.createTransport({
      host: mailServer.server_ip,
      port: mailServer.port,
      secure: secure,
      requireTLS: requireTLS,
      auth: {
        user: mailServer.username,
        pass: mailServer.password
      }
    });
  
      await transporter.verify((error, success) => {
          if (error) {
            console.error('Verify error:', error);
          } else {
            console.log('Server is ready to take our messages',success);
          }
        });

    const mailOptions = {
      from: `"${mailServer.sender_name || 'No-Reply'}" <${mailServer.from_email}>`,
      to: tos, // Change 'to' to 'tos' to match the variable
      subject,
      html: body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully. Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error(error.stack);
  }
};

export { EmailTemplate, sendMail, parseTemplate };





