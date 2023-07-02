export type User = {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserWithJwt = { jwt: string; user: User };

export type UserLogin = {
  identifier: string;
  password: string;
};
