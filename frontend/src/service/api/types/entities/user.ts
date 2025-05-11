/*
	"id": 2,
	"login": "illoprin",
	"firstname": "Шалтай",
	"secondname": "Кунцевич",
	"phone": "9198192998",
	"email": "illoprin@gmail.com",
	"password": "$2b$04$SQ.j4HCah.Hcr2DvthQWDeKbzIs04HpbJK.crAS1T1/ZKyvXPEhpe",
	"avatarpath": "/upload/protected/8383fb98-d36b-418e-b549-d2f5832ee414.jpg",
	"role": 1,
	"level": "Basic"
 */

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
