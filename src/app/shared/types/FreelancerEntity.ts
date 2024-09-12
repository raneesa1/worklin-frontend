import { IApplication, IInviteFreelancer } from '../../pages/client-pages/job-management/interfaces/jobPost';
import { Address } from './interfaces/address';
import { Education } from './interfaces/education';
import { Experience } from './interfaces/experience';
import { ILanguage } from './ILanguage';
import { Category, Skill } from '../../pages/admin-management/types/category.model';

export interface FreelancerEntity {
  _id?: string;
  firstName: string;
  email: string;
  password?: string;
  secondName?: string;
  phoneNumber: number;
  accountType: string;
  subCategory: string[];
  bio: string;
  role: string;
  picture: string;
  country: string;
  isBlocked: boolean;
  resume: string;
  category: Category[];
  experience: Experience[];
  education: Education[];
  dob: string;
  languages: ILanguage[];
  isProfileCompleted: boolean;
  address?: Address[];
  hourlyRate: number;
  serviceRate: number;
  freelancedBefore: string;
  freelancingGoal: string;
  skill: Skill[];
  status?: boolean | string;
  appliedJobs?: IApplication[];
  videoIntroduction?: string;
  resumeFileName?: string;
}
