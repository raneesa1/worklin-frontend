export interface IPayment {
  _id?: string;
  offerId: string;
  contractTitle: string;
  sender: {
    accountType: string;
    senderId: string;
  };
  receiver: {
    accountType: string;
    receiverId: string;
  };
  status: 'issued' | 'due' | 'overdue' | 'paid' | 'paymentFailed';
  totalAmount: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
