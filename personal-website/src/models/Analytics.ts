import { Schema, model, models, Document } from 'mongoose';

export interface IAnalytics extends Document {
  type: 'page_view' | 'project_view' | 'blog_view' | 'contact_submit';
  path: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
  resourceId?: string; // project id, blog slug, etc.
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'project_view', 'blog_view', 'contact_submit']
    },
    path: {
      type: String,
      required: true
    },
    referrer: String,
    userAgent: String,
    ip: String,
    country: String,
    city: String,
    resourceId: String
  },
  {
    timestamps: true,
    collection: 'analytics'
  }
);

AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ resourceId: 1 });
AnalyticsSchema.index({ createdAt: -1 });

export default models.Analytics || model<IAnalytics>('Analytics', AnalyticsSchema);