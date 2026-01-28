export interface SiteData {
  _id?: string;
  name: string;
  title: string;
  description: string;
  bio?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resumeUrl?: string;
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  level: number;
  icon?: string;
  order: number;
}

export interface Experience {
  _id?: string;
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

export interface Project {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AnalyticsData {
  totalViews: number;
  uniqueViews: number;
  dailyViews: { _id: string; count: number }[];
  viewsByType: { _id: string; count: number }[];
  topPages: { _id: string; count: number }[];
  topReferrers: { _id: string; count: number }[];
}