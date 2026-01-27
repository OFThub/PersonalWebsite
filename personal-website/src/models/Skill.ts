import { Schema, model, models, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  level: number;
  icon?: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Yetenek adı gerekli'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Kategori gerekli'],
      enum: ['frontend', 'backend', 'database', 'tools', 'other'],
      default: 'other'
    },
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    },
    icon: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'skills'
  }
);

SkillSchema.index({ order: 1 });

export default models.Skill || model<ISkill>('Skill', SkillSchema);