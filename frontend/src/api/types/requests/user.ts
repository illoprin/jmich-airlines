export interface UserRegistrationPayload {
  login: string;
  password: string;
  email: string;
  phone: string;
  firstname: string;
  secondname: string;
}

export interface UserLoginPayload {
  login: string;
  password: string;
}
