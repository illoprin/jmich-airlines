import type { Entry } from "../lib/repository/base.repository";

export interface DiscountEntry extends Entry {
	code: string;
	amount: number;
	valid_until: Date;
}