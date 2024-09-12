export interface Experience {
  _id?: string;
  userId?: any;
  title: string;
  company: string;
  jobLocation: string;
  country: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  startMonth?: string; // Add these properties
  startYear?: string; // Add these properties
  endMonth?: string; // Add these properties
  endYear?: string;
  isCurrentlyWorking?: boolean;
}
