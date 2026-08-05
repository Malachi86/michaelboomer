export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

export const messages: Message[] = [];
