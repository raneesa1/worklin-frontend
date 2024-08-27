import { Skill } from './skill';

enum jobPostStatus {
  client = 'active',
  freelancer = 'stopped',
  admin = 'draft',
}

enum applicationStatus {
  accepted = 'accepted',
  rejected = 'rejected',
  hired = 'hired',
}
export interface IApplication {
  _id?: string;
  freelancerId: string;
  resume: string;
  freelancerName: string;
  email: string;
  freelancerProfile: string;
  status: applicationStatus;
  jobPostId: string;
  freelancerCategory: string;
  freelancerLocation: string;
  freelancerTitle: string;
  publicId: string;
}
export interface IJobPost {
  _id?: string;
  clientId?: string;
  title?: string;
  description?: string;
  duration: string;
  experience: string;
  skills: Skill[];
  priceFrom?: number;
  priceTo?: number | null;
  rate?: string;
  createdAt?: Date;
  budget?: string;
  location?: string;
  isFavorite?: boolean;
  isActive?: boolean;
  acceptedApplication?: string[];
  hires?: string[];
  applications?: IApplication[];
  status?: jobPostStatus;
}
