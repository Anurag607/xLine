// Type definitions for the Data...

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

// Type definitions for the login form...

interface LoginForm extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

export interface LoginFormEl extends HTMLFormElement {
  readonly elements: LoginForm;
}

export type LoginTemplate = { email: string; password: string };

// Type definitions for the signup form...

interface SignupForm extends HTMLFormControlsCollection {
  cnfrmpass: string;
  email: string;
  name: string;
  password: string;
}

export interface SignupFormEl extends HTMLFormElement {
  readonly elements: SignupForm;
}

export type SignupTemplate = {
  cnfrmpass: string;
  email: string;
  name: string;
  password: string;
};
