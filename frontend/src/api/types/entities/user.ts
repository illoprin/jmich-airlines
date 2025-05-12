export enum UserRole {
  Customer = 1,
  Moderator = 2,
  Admin = 3,
}

export enum UserLevel {
  Basic = 'Basic',
  Silver = 'Silver',
  Gold = 'Gold',
  Premium = 'Premium',
  Platinum = 'Platinum',
}

export interface User {
  id: number;
  login: string;
  firstname: string;
  secondname: string;
  password?: string;
  email: string;
  avatarpath: string;
  role: UserRole;
  level: UserLevel;
}
