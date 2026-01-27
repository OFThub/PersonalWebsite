import { Schema, model, models, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies?: string[];
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: {
      type: String,
      required: [true, 'Pozisyon başlığı gerekli'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Şirket adı gerekli'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: String,
      required: [true, 'Başlangıç tarihi gerekli']
    },
    endDate: {
      type: String
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: [true, 'Açıklama gerekli']
    },
    technologies: {
      type: [String],
      default: []
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'experiences'
  }
);

ExperienceSchema.index({ order: 1 });

export default models.Experience || model<IExperience>('Experience', ExperienceSchema);