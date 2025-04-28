import { faker } from "@faker-js/faker/locale/ru";
import { FlightDTO } from "../../types/flight.type";
import { UserPublicDTO } from "../../types/user.type";

/**
 * Function that generates QR Code for booking
 * @param user user entry
 * @param flight flight entry
 * @param date purchase date
 * @returns QR Code url
 */
export function generateQRCode(user: UserPublicDTO, flight: FlightDTO, date: Date): string {
	return faker.internet.url(); 
}