import { Schema, model, models, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email gerekli'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email giriniz']
    },
    subject: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Mesaj gerekli'],
      minlength: [10, 'Mesaj en az 10 karakter olmalı']
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new'
    }
  },
  {
    timestamps: true,
    collection: 'contacts'
  }
);

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

export default models.Contact || model<IContact>('Contact', ContactSchema);