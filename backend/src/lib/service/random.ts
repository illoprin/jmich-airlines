import { randomBytes } from "crypto";

export type Range = { min: number; max: number };

export function generateRandomGate(): string {
  const charset = "ABCDEFGHIGKLMNOPQRSTUVWXYZ";
  const digits = "1234567890";
  let gate = charset[Math.floor(Math.random() * charset.length)];
  for (let i = 0; i < 2; i++) {
    gate += digits[Math.floor(Math.random() * digits.length)];
  }
  return gate;
}

export function generateRandomString(length: number = 10): string {
  const randomBuffer = randomBytes(length); // Generate random uint8 array
  return randomBuffer.toString("hex").slice(0, length);
}

function getRandomChar(str: string): string {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str[randomIndex];
}

export function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function randomID(length: number): number {
  return Math.floor(Math.random() * length) + 1;
}

export function randomIntInRange(range: Range): number {
  return Math.floor(Math.random() * (range.max - range.min)) + range.min;
}

export function generateRandomRouteCode(): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  const randomLetter = getRandomChar(charset);
  let randomDigits = "";
  for (let i = 0; i < 3; i++) {
    randomDigits += getRandomChar(digits);
  }

  return randomLetter + randomDigits;
}
