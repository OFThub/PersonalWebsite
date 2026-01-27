import { Schema, model, models, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  name: string;
  title: string;
  description: string;
  email?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  resumeUrl?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Başlık gerekli'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Açıklama gerekli'],
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email giriniz']
    },
    phone: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    },
    resumeUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'sitesettings'
  }
);

export default models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema);