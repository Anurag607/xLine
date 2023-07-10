export type userDetails = {
  email: string;
  name: string;
  avatar: string;
};

export type groupType = {
  id: string;
  name: string;
  users: string;
  createdAt: string;
  admin: string;
};

export type messageType = {
  id: string;
  avatar: string;
  createdAt: string;
  name: string;
  replyTo?: string | null;
  room: string;
  text: string;
  image?: string | null;
  uid: string;
};
