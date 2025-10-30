import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { IBooking } from '../models/Booking';
import { IExperience } from '../models/Experience';

// Create transporter
const createTransporter = () => {
  if (!config.email.host || !config.email.user || !config.email.password) {
    console.warn('⚠️  Email service not configured');
    return null;
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

const transporter = createTransporter();

// Send booking confirmation email
export const sendBookingConfirmation = async (
  booking: IBooking,
  experience: IExperience
): Promise<void> => {
  if (!transporter) {
    console.log('📧 [MOCK EMAIL] Booking confirmation would be sent to:', booking.customerEmail);
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #fbbf24; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; color: #6b7280; }
        .detail-value { color: #111827; }
        .total { font-size: 1.25rem; font-weight: bold; color: #fbbf24; }
        .footer { text-align: center; color: #6b7280; margin-top: 20px; font-size: 0.875rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: white;">Booking Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hi ${booking.customerName},</h2>
          <p>Your booking for <strong>${experience.title}</strong> has been confirmed!</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Reference ID:</span>
              <span class="detail-value"><strong>${booking.referenceId}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Experience:</span>
              <span class="detail-value">${experience.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${booking.timeSlot}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${experience.location}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Quantity:</span>
              <span class="detail-value">${booking.quantity} person(s)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${experience.duration}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Subtotal:</span>
              <span class="detail-value">₹${booking.subtotal}</span>
            </div>
            ${booking.discount > 0 ? `
            <div class="detail-row">
              <span class="detail-label">Discount:</span>
              <span class="detail-value" style="color: #10b981;">- ₹${booking.discount}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">CGST (9%):</span>
              <span class="detail-value">₹${booking.cgst}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">SGST (9%):</span>
              <span class="detail-value">₹${booking.sgst}</span>
            </div>
            <div class="detail-row" style="border-bottom: none; margin-top: 10px;">
              <span class="detail-label total">Total Paid:</span>
              <span class="detail-value total">₹${booking.total}</span>
            </div>
          </div>

          <h3>What's Included:</h3>
          <ul>
            ${experience.includedItems.map(item => `<li>${item}</li>`).join('')}
          </ul>

          <p><strong>Important:</strong> Please arrive 15 minutes before your scheduled time. Bring a valid ID and your booking reference number.</p>
          
          <p>If you have any questions, feel free to contact us.</p>
          
          <p>See you soon! 🌟</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>© ${new Date().getFullYear()} BookIt - Highway Delite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.email.from,
      to: booking.customerEmail,
      subject: `Booking Confirmed - ${experience.title} - ${booking.referenceId}`,
      html: emailHtml,
    });

    console.log('✅ Booking confirmation email sent to:', booking.customerEmail);
  } catch (error) {
    console.error('❌ Failed to send booking confirmation email:', error);
    // Don't throw error - booking should still succeed even if email fails
  }
};

// Send cancellation email
export const sendCancellationEmail = async (
  booking: IBooking,
  experience: IExperience
): Promise<void> => {
  if (!transporter) {
    console.log('📧 [MOCK EMAIL] Cancellation email would be sent to:', booking.customerEmail);
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; color: #6b7280; margin-top: 20px; font-size: 0.875rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: white;">Booking Cancelled</h1>
        </div>
        <div class="content">
          <h2>Hi ${booking.customerName},</h2>
          <p>Your booking for <strong>${experience.title}</strong> has been cancelled.</p>
          <p><strong>Reference ID:</strong> ${booking.referenceId}</p>
          <p><strong>Refund Amount:</strong> ₹${booking.total}</p>
          <p>The refund will be processed within 5-7 business days.</p>
          <p>We hope to see you again soon!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} BookIt - Highway Delite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.email.from,
      to: booking.customerEmail,
      subject: `Booking Cancelled - ${booking.referenceId}`,
      html: emailHtml,
    });

    console.log('✅ Cancellation email sent to:', booking.customerEmail);
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error);
  }
};