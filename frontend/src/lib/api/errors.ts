export class UserLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserLoginError";
  }
}

export class UserTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserTokenError";
  }
}