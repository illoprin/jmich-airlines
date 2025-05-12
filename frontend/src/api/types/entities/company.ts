export interface BaggageRule {
  id?: number;
  max_free_weight: number;
  price_per_kg: number;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  baggage_rule?: BaggageRule;
  baggage_rule_id?: number;
}
