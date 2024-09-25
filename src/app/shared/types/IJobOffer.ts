export interface mileStone {
  _id?: string;
  description: string;
  date: Date;
  amount: number;
  isPaid: boolean;
}
export enum paymentOption {
  oneTime = 'oneTime',
  mileStone = 'mileStone',
}
export enum offerStatus {
  active = 'accepted',
  expired = 'rejected',
}
export enum paymentType {
  hourly = 'hourly',
  fixed = 'fixed',
}
export interface IJobOffer {
  _id: string;
  clientId: string;
  freelancerId: String;
  hiringTeam: String;
  relatedJobId: String;
  title: String;
  paymentType: string;
  paymentOption: paymentOption;
  totalAmount: number;
  hourlyRate: number;
  numberOfHours: number;
  mileStone: string;
  description: string;
  files: string[];
  offerStatus: offerStatus;
  isAccepted: Boolean;
  dueDate: Date;
  createdAt?:Date
}
