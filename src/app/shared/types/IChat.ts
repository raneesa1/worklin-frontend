
export interface IMessage {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  chatId: string;
  type: string;
  status?: string;
  createdAt?: string;
}

export interface IRoom {
  _id: string;
  message: IMessage[];
  participants: string[];
  lastMessage: string;
  createdAt: string;
}
