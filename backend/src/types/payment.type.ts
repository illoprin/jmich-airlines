import type { Entry } from "./repository.type";

export interface PaymentEntry extends Entry{
	user_id: number;
	number: string; // Card number
	expires: string; // Card expire date
	cvv: string; // Card CVV number
}