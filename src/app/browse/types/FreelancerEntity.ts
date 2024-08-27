import { Category, Skill } from '../../admin-management/types/category.model';
import { Address } from '../../user-management/interfaces/address';
import { Education } from '../../user-management/interfaces/education';
import { Experience } from '../../user-management/interfaces/experience';
import { ILanguage } from './ILanguage';

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
  status?: boolean 
}
