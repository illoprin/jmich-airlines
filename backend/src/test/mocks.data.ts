import { faker } from "@faker-js/faker/locale/ru";
import type { AirportEntry, CityEntry } from "../types/city.type";
import type { BaggageRuleEntry, CompanyEntry } from "../types/company.type";
import { FlightStatus, type FlightEntry } from "../types/flight.type";
import { Roles, UserEntry } from "../types/user.type";
import { PaymentEntry } from "../types/payment.type";
import { BookingEntry } from "../types/booking.type";

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
		max_free_weight: 23,
		price_per_kg: 500,
	},
	{
		max_free_weight: 32,
		price_per_kg: 400,
	},
	{
		max_free_weight: 10,
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

const mockFlights: FlightEntry[] = [
	{
		departure_airport_id: 3,
		arrival_airport_id: 1,
		departure_date: new Date(Date.now() + DAY_MILLISECONDS), // Tomorrow
		arrival_date: new Date(
			Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 1.5
		), // After hour
		company_id: 3,
		price: 3600,
		route_code: "B767",
		seats_available: 34,
		status: FlightStatus.ACTIVE,
	},
	{
		departure_airport_id: 4,
		arrival_airport_id: 3,
		departure_date: new Date(Date.now() + DAY_MILLISECONDS), // Yesterday
		arrival_date: new Date(
			Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 2
		), // After hour
		company_id: 2,
		price: 3600,
		route_code: "Z837",
		seats_available: 31,
		status: FlightStatus.ACTIVE,
	},
	{
		departure_airport_id: 5,
		arrival_airport_id: 2,
		departure_date: new Date(Date.now() + DAY_MILLISECONDS), // Yesterday
		arrival_date: new Date(
			Date.now() + DAY_MILLISECONDS + HOUR_MILLISECONDS * 5
		), // After hour
		company_id: 1,
		price: 3600,
		route_code: "C717",
		seats_available: 34,
		status: FlightStatus.ACTIVE,
	},
];

function getMockUsers(length: number): UserEntry[] {
	const mockUsers: UserEntry[] = [];
	for (let i = 0; i < length; ++i) {
		mockUsers.push({
			firstname: faker.person.firstName("male"),
			secondname: faker.person.firstName(),
			login: faker.internet.username(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number({ style: "international" }).slice(2),
			role: Roles.Customer,
		});
	}
	return mockUsers;
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

export type Range = { min: number; max: number };

function getMockBooking(
	usersCount: number,
	flightsCount: number,
	baggageWeightRange: Range,
	costRange: Range
): BookingEntry {
	const user_id = Math.floor(Math.random() * usersCount) + 1;
	const baggage_weight =
		Math.floor(
			Math.random() * (baggageWeightRange.max - baggageWeightRange.min)
		) + baggageWeightRange.min;
	const cost =
		Math.floor(Math.random() * (costRange.max - costRange.min)) + costRange.min;
	const flight_id = Math.floor(Math.random() * flightsCount) + 1;
	const booking: BookingEntry = {
		user_id,
		qr_code: faker.internet.url({ protocol: "http", appendSlash: false }),
		baggage_weight,
		cost,
		flight_id,
	};
	return booking;
}

export {
	mockCities,
	mockAirports,
	mockBaggageRules,
	mockCompanies,
	mockFlights,
	getMockUsers,
	getMockPayment,
	getMockBooking,
};
