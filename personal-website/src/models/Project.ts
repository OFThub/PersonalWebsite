import { Schema, model, models, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
  order: number;
  status: 'completed' | 'in-progress' | 'planned';
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Proje başlığı gerekli'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Kısa açıklama gerekli'],
      maxlength: 200
    },
    longDescription: {
      type: String
    },
    technologies: {
      type: [String],
      required: [true, 'En az bir teknoloji gerekli'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'En az bir teknoloji belirtilmeli'
      }
    },
    github: {
      type: String,
      trim: true
    },
    demo: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'completed'
    }
  },
  {
    timestamps: true,
    collection: 'projects'
  }
);

ProjectSchema.index({ order: 1 });
ProjectSchema.index({ featured: -1 });

export default models.Project || model<IProject>('Project', ProjectSchema);