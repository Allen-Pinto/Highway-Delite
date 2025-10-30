import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true 
  },
  googleId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  picture: { 
    type: String 
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
