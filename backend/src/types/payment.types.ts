export interface PaymentEntry {
	id?: number;
	user_id: number;
	number: string; // Card number
	expires: string; // Card expire date
	cvv: string; // Card CVV number
}