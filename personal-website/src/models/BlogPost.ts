import { Schema, model, models, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  author: Schema.Types.ObjectId;
  published: boolean;
  publishedAt?: Date;
  views: number;
  readTime: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Başlık gerekli'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug gerekli'],
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'Özet gerekli'],
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'İçerik gerekli']
    },
    coverImage: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      required: [true, 'Kategori gerekli'],
      enum: ['technology', 'programming', 'tutorial', 'career', 'personal', 'other'],
      default: 'other'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date
    },
    views: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number,
      default: 5
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'blogposts'
  }
);

// Indeksler
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ published: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ category: 1 });

// Middleware: Yayınlanma tarihi otomatik atama
BlogPostSchema.pre<IBlogPost>('save', async function () {
  // 'this' otomatik olarak IBlogPost tipindedir
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// Middleware: Okuma süresi hesaplama
BlogPostSchema.pre<IBlogPost>('save', async function () {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
});

export default models.BlogPost || model<IBlogPost>('BlogPost', BlogPostSchema);