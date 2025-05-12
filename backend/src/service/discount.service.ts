import { DiscountRepository } from "../repository/discount.repository";
import { DiscountEntry } from "../types/repository/discount";
import {
  InvalidFieldError,
  NotFoundError,
  NotUniqueError,
} from "../lib/service/errors";
import { StorageError, StorageErrorType } from "@/lib/repository/storage-error";

export class DiscountService {
  constructor(private discountRepo: DiscountRepository) {}

  public add(discount: DiscountEntry): bigint {
    if (discount.valid_until < new Date()) {
      throw new InvalidFieldError(
        "the promo code validity period cannot be in the past",
      );
    }
    try {
      const lastID = this.discountRepo.add(discount);
      return lastID;
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError(
            `invalid field${err.field ? " " + err.field : ""}`,
          );
        } else if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError("same discount code exists");
        }
      }
      throw err;
    }
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

    if (new Date(discount.valid_until) < new Date()) {
      throw new NotFoundError("invalid discount code");
    }
    return discount;
  }

  public getValidDiscounts(): DiscountEntry[] {
    const vdsc = this.discountRepo.getAllValid();
    return vdsc ?? [];
  }

  public deleteInvalid(): number {
    return this.discountRepo.removeInvalid();
  }

  public removeByCode(code: string): void {
    const changes = this.discountRepo.removeByCode(code);
    if (!changes) {
      throw new NotFoundError("discount not found");
    }
  }

  public removeByID(id: number): void {
    const changes = this.discountRepo.removeByID(id);
    if (!changes) {
      throw new NotFoundError("discount not found");
    }
  }
}
