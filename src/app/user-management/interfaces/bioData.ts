export interface BioData {
  userId?: string;
  languages: { language: string; proficiency: string }[]; // Array of objects, not strings
  hourlyRate: number | null; // Allow for null values
  serviceRate: number | null; // Allow for null values
  bio: string;
}
