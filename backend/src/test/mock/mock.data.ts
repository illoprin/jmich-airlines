import { faker } from "@faker-js/faker/locale/ru";
import type { AirportEntry, CityEntry } from "../../types/city.type";
import type { BaggageRuleEntry, CompanyEntry } from "../../types/company.type";
import { FlightStatus, type FlightEntry } from "../../types/flight.type";
import { Roles, UserEntry } from "../../types/user.type";
import { PaymentEntry } from "../../types/payment.type";
import { BookingEntry } from "../../types/booking.type";
import { DiscountEntry } from "../../types/discount.type";
import { generateRandomRouteCode, generateRandomString, randomID, randomIntInRange, Range } from "../../lib/service/random";

export const DAY_MILLISECONDS = 86400000;
export const HOUR_MILLISECONDS = 3600000;

const mockCities: CityEntry[] = [
	{
		name: "Москва",
		image: ":city-image:",
	},
	{
		name: "Санкт-Петербург",
		image: ":city-image:",
	},
	{
		name: "Самара",
		image: ":city-image:",
	},
	{
		name: "Екатеринбург",
		image: ":city-image:",
	},
	{
		name: "Сочи",
		image: ":city-image:",
	},
	{
		name: "Казань",
		image: ":city-image:",
	},
];

const mockAirports: AirportEntry[] = [
	{
		name: "Шереметьево",
		code: "SVO",
		city_id: 1,
	},
	{
		name: "Домодедово",
		code: "DME",
		city_id: 1,
	},
	{
		name: "Пулково",
		code: "LED",
		city_id: 2,
	},
	{
		name: "Курумоч",
		code: "KUF",
		city_id: 3,
	},
	{
		name: "Кольцово",
		code: "SVX",
		city_id: 4,
	},
	{
		name: "Адлер",
		code: "AER",
		city_id: 5,
	},
	{
		name: "Казань",
		code: "KZN",
		city_id: 6,
	},
];

const mockBaggageRules: BaggageRuleEntry[] = [
	{
		max_free_weight: 2,
		price_per_kg: 500,
	},
	{
		max_free_weight: 3,
		price_per_kg: 400,
	},
	{
		max_free_weight: 6,
		price_per_kg: 1000,
	},
];

const mockCompanies: CompanyEntry[] = [
	{
		name: "Аэрофлот",
		logo: ":logo:",
		baggage_rule_id: 1,
	},
	{
		name: "S7 Airlines",
		logo: ":logo:",
		baggage_rule_id: 1,
	},
	{
		name: "Победа",
		logo: ":logo:",
		baggage_rule_id: 3,
	},
	{
		name: "Уральские авиалинии",
		logo: ":logo:",
		baggage_rule_id: 1,
	},
	{
		name: "Россия",
		logo: ":logo:",
		baggage_rule_id: 2,
	},
	{
		name: "Nordwind Airlines",
		logo: ":logo:",
		baggage_rule_id: 1,
	},
];


/**
 * Creates random flight
 * @param maxFlightDuration - Duration of flights in hours
 */
function getMockFlight(maxFlightDuration: number): FlightEntry {
	const departure_airport_id = randomID(mockAirports.length);
	const arrival_airport_id = randomID(mockAirports.length);
	const company_id = randomID(mockCompanies.length);
	const seats_available = Math.floor(10 + Math.random() * 100);
	const price = Math.floor(Math.random() * 18_000 + 2000);

	return {
		departure_airport_id,
		arrival_airport_id,
		departure_date: new Date(Date.now() + DAY_MILLISECONDS), // Tomorrow
		arrival_date: new Date(
			Date.now() +
				DAY_MILLISECONDS +
				HOUR_MILLISECONDS * (Math.random() * maxFlightDuration + 0.3)
		), // After hour
		company_id,
		price,
		route_code: generateRandomRouteCode(),
		seats_available,
		status: FlightStatus.ACTIVE,
	};
}

function getMockUser(role: Roles = Roles.Customer): UserEntry {
	return {
		firstname: faker.person.firstName("male"),
		secondname: faker.person.firstName(),
		login: faker.internet.username(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		phone: faker.phone.number({ style: "international" }).slice(2),
		role: Roles.Customer,
	};
}

function getMockPayment(user_id: number, length: number): PaymentEntry[] {
	const mockPayment: PaymentEntry[] = [];
	for (let i = 0; i < length; i++) {
		mockPayment.push({
			user_id,
			number: faker.finance.creditCardNumber("visa"),
			expires: faker.finance.creditCardNumber("visa").slice(4),
			cvv: faker.finance.creditCardCVV(),
		});
	}

	return mockPayment;
}


function getMockBooking(
	usersCount: number,
	flightsCount: number,
	baggageWeightRange: Range,
	costRange: Range,
): BookingEntry {
	const user_id = randomID(usersCount);
	const baggage_weight = randomIntInRange(baggageWeightRange);
	const cost = randomIntInRange(costRange)
	const flight_id = randomID(flightsCount);
	const booking: BookingEntry = {
		user_id,
		qr_code: faker.internet.url({ protocol: "http", appendSlash: false }),
		created: new Date(),
		seats: 1,
		baggage_weight,
		cost,
		flight_id,
	};
	return booking;
}

export function getMockDiscount(length: number = 10, valid: boolean = true): DiscountEntry {
	const amount = Math.random();
	const code = generateRandomString(length);
	return {
		amount,
		code,
		valid_until: valid ? new Date(Date.now() + DAY_MILLISECONDS * 10) : new Date(Date.now() - DAY_MILLISECONDS * 2),
	};
}

export {
	mockCities,
	mockAirports,
	mockBaggageRules,
	mockCompanies,
	getMockUser,
	getMockPayment,
	getMockBooking,
	getMockFlight,
};
