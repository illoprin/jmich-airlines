import { DiscountRepository } from "../repository/discount.repository";
import { DiscountEntry } from "../types/discount.type";
import { InvalidFieldError, NotFoundError } from "../types/service.type";

export class DiscountService {
	constructor(private discountRepo: DiscountRepository) {}

	public add(discount: DiscountEntry): bigint {
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

	public getDiscountByCode(code: string): DiscountEntry {
		const discount = this.discountRepo.getByCode(code);
		if (!discount) {
			throw new NotFoundError("invalid discount code");
		}
		return discount;
	}

	public getValidDiscounts(): DiscountEntry[] {
		const vdsc = this.discountRepo.getAllValid();
		return vdsc ?? [];
	}

	public deleteInvalid(): number {
		return this.discountRepo.deleteInvalid();
	}

	public removeByID(id: number): void {
		const changes = this.discountRepo.removeByID(id)
		if (!changes) {
			throw new NotFoundError("discount not found");
		}
	}
}