import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    const searchRegex = { $regex: query, $options: 'i' };

    // Search in blog posts
    const blogPosts = await BlogPost.find({
      published: true,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ]
    })
      .select('title slug excerpt')
      .limit(5);

    // Search in projects
    const projects = await Project.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { technologies: searchRegex }
      ]
    })
      .select('_id title description')
      .limit(5);

    // Search in skills
    const skills = await Skill.find({
      name: searchRegex
    })
      .select('name category')
      .limit(5);

    // Search in experiences
    const experiences = await Experience.find({
      $or: [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex }
      ]
    })
      .select('_id title company')
      .limit(5);

    // Format results
    const results = [
      ...blogPosts.map(post => ({
        type: 'blog',
        id: post.slug,
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`
      })),
      ...projects.map(project => ({
        type: 'project',
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        url: `/projects/${project._id}`
      })),
      ...skills.map(skill => ({
        type: 'skill',
        id: skill._id.toString(),
        title: skill.name,
        description: skill.category,
        url: '/#about'
      })),
      ...experiences.map(exp => ({
        type: 'experience',
        id: exp._id.toString(),
        title: exp.title,
        description: exp.company,
        url: '/#experience'
      }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Arama başarısız' },
      { status: 500 }
    );
  }
}