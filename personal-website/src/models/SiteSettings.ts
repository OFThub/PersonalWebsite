import { Schema, model, models, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  title: string;
  name: string;
  description: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    email: {
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
    }
  },
  {
    timestamps: true,
    collection: 'sitesettings' // 👈 netlik için
  }
);

export default models.SiteSettings ||
  model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
