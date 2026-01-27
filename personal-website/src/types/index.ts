// ========================
// TYPE DEFINITIONS
// ========================

export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}

export interface ISiteSettings {
  _id?: string;
  name: string;
  title: string;
  description: string;
  email?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
}

export interface ISkill {
  _id?: string;
  name: string;
  category: string;
  level: number; // 1-100
  icon?: string;
  order?: number;
}

export interface IExperience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies?: string[];
  order?: number;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
  order?: number;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface IContact {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Date;
}