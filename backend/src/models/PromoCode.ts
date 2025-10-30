import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  firstTimeUserOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'flat'],
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: 0
  },
  minOrderValue: { 
    type: Number,
    min: 0
  },
  maxDiscount: { 
    type: Number,
    min: 0
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  usageLimit: { 
    type: Number,
    min: 1
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  applicableCategories: [{ 
    type: String 
  }],
  firstTimeUserOnly: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);