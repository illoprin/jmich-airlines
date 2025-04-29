import { DiscountRepository } from "../repository/discount.repository";
import { DiscountEntry } from "../types/discount.type";
import { InvalidFieldError, NotFoundError } from "../types/service.type";

export class DiscountService {
	constructor(private discountRepo: DiscountRepository) {}

	public addDiscount(discount: DiscountEntry): bigint {
		if (discount.valid_until < new Date()) {
			throw new InvalidFieldError("the promo code validity period cannot be in the past");
		}

		const lastID = this.discountRepo.add(discount);
		return lastID;
	}

	public getAllDiscounts(): DiscountEntry[] {
		const dsc = this.discountRepo.getAll();
		return dsc ?? [];
	}

	public getValidDiscounts(): DiscountEntry[] {
		const vdsc = this.discountRepo.getAllValid();
		return vdsc ?? [];
	}

	public deleteUnvalid(): number {
		return this.discountRepo.deleteUnvalid();
	}
}