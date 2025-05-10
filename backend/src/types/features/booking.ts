export interface TrandingBookingsDTO {
	popularity: number;
	flight_id: number;
	departure_city_name: string;
	departure_city_image: string;
	departure_airport_code: string;
	departure_date: Date;
	arrival_city_name: string;
	arrival_city_image: string;
	arriva_airport_code: string;
	arrival_date: Date;
	price: number; 
}

export interface BookingQRPayload {
	user_firstname: string;
	user_secondname: string;
	route_code: string;
	booking_seats: number;
	booking_cost: number;
	terminal_gate: string;
	created: Date;
}