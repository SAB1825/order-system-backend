export type registerInput = {
  email: string;
  name: string;
  password: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
};

export type AuthResponse = {
  user: UserType;
};

export type AuthRegisteredEventPayload = {
  id: string;
  name: string;
  email: string;
};
