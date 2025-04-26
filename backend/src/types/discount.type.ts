import type { Entry } from "./repository.type";

export interface DiscountEntry extends Entry {
	code: string;
	valid_until: Date;
}