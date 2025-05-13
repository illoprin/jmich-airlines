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

export class UserRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserRegistrationError";
  }
}

export class InvalidPayload extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPayload";
  }
}

export class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingError";
  }  
}