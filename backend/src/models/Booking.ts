import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId;
  experience: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  bookingDate: Date;
  timeSlot: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  discount: number;
  total: number;
  promoCode?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  referenceId: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  },
  experience: { 
    type: Schema.Types.ObjectId, 
    ref: 'Experience', 
    required: true 
  },
  slotId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  bookingDate: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  customerPhone: {
    type: String,
    required: true
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true 
  },
  promoCode: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  referenceId: { 
    type: String, 
    required: true,
    unique: true
  },
  idempotencyKey: { 
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ customerEmail: 1, createdAt: -1 });
BookingSchema.index({ experience: 1, status: 1 });
BookingSchema.index({ referenceId: 1 });
BookingSchema.index({ idempotencyKey: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);