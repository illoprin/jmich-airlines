import { Entry } from "@/lib/repository/base.repository";

export interface CompanyDTO extends Entry {
  name: string;
  logo: string;
  baggage_rule: {
    id: number;
    max_free_weight: number;
    price_per_kg: number;
  };
}
