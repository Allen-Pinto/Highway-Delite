import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  availableSpots: number;
  bookedSpots: number;
  price: number;
}

export interface IExperience extends Document {
  title: string;
  description: string;
  location: string;
  category: string;
  basePrice: number;
  image: string;
  images?: string[];
  duration: string;
  includedItems: string[];
  maxGroupSize: number;
  slots: ISlot[];
  isActive: boolean;
  rating?: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>({
  date: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    required: true 
  },
  availableSpots: { 
    type: Number, 
    required: true,
    min: 0
  },
  bookedSpots: { 
    type: Number, 
    default: 0,
    min: 0
  },
  price: { 
    type: Number, 
    required: true 
  }
}, { _id: true });

const ExperienceSchema = new Schema<IExperience>({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['kayaking', 'sunrise', 'cruise', 'trail', 'jumping', 'adventure', 'beach', 'trekking']
  },
  basePrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  image: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  duration: { 
    type: String, 
    required: true 
  },
  includedItems: [{ 
    type: String 
  }],
  maxGroupSize: { 
    type: Number, 
    default: 10,
    min: 1
  },
  slots: [SlotSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5 
  },
  totalBookings: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

ExperienceSchema.index({ location: 1, category: 1 });
ExperienceSchema.index({ isActive: 1 });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);