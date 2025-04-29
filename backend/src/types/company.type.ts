import type { Entry } from "../lib/repository/base.repository";

export interface CompanyEntry extends Entry {
	name: string;
	logo: string;
	baggage_rule_id: number;
}

export interface CompanyDTO extends Entry {
	name: string;
	logo: string;
	baggage_rule: {
		id: number;
		max_free_weight: number;
		price_per_kg: number;
	}
}

export interface BaggageRuleEntry extends Entry {
	max_free_weight: number;
	price_per_kg: number;
}