import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import Project from '@/models/Project';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  await connectDB();

  // Get all published blog posts
  const posts = await BlogPost.find({ published: true }).select('slug updatedAt');
  
  // Get all projects
  const projects = await Project.find().select('_id updatedAt');

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }
  ];

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project._id}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}