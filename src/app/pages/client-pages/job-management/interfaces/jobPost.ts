import { Skill } from './skill';

export enum jobPostStatus {
  active = 'active',
  stopped = 'stopped',
  draft = 'draft',
}

export enum applicationStatus {
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
  isActive?: boolean;
  acceptedApplication?: string[];
  hires?: string[];
  isFavorite?: boolean;
  applications?: IApplication[];
  status?: jobPostStatus;
  invitedFreelancers?: IInviteFreelancer[];
  appliedFreelancers?:string[]
}
export interface IInviteFreelancer {
  _id?: string;
  freelancerId: string;
  clientId: string;
  jobId: string;
  clientName: string;
  requestedAt?: Date;
  description: string;
  status?: string;
}
