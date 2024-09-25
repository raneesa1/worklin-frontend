
export interface clientEntity {
  _id?: string;
  firstName: string;
  secondName?: string;
  phoneNumber: number;
  picture: string;
  email: string;
  password: string;
  accountType: string;
  isVerified: boolean;
  country: string;
  jobPost: string[];
  createdAt?: Date;
  CompanyName: string;
  hires: string[];
  savedTalents: string[];
  projects: string[];
}
