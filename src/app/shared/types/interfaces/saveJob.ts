enum JobInvitesStatus {
  received = 'received',
  accepted = 'accepted',
  rejected = 'rejected',
}

export interface IJobInvites {
  _id?: string;
  clientId: string;
  freelancerId: string;
  jobId: string;
  description: string;
  requestedAt?: Date;
  clientName: string;
  status?: JobInvitesStatus;
}

export enum savedJobStatus {
  active = 'active',
  stopped = 'stopped',
  draft = 'draft',
}
export interface ISavedJobs {
  _id?:string
  freelancerId: string;
  clientId: string;
  jobId: string;
  title: string;
  description: string;
  duration: string;
  experience: string;
  skills: string[];
  priceFrom: Number;
  priceTo: Number;
  rate: string;
  createdAt: Date;
  isActive: boolean;
  hires: number;
  status: savedJobStatus;
  applications: Number;
  location:string
}
