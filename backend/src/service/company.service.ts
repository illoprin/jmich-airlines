import {
  StorageError,
  StorageErrorType,
} from "../lib/repository/storage-error";
import type { BaggageRuleRepository } from "../repository/baggage-rule.repository";
import type { CompanyRepository } from "../repository/company.repository";
import type {
  BaggageRuleEntry,
  CompanyEntry,
} from "../types/repository/company";
import {
  InvalidFieldError,
  NotFoundError,
  NotUniqueError,
  RelatedDataError,
} from "../lib/service/errors";
import type { CompanyDTO } from "../types/dto/company";

export class CompanyService {
  constructor(
    private companyRepo: CompanyRepository,
    private baggageRuleRepo: BaggageRuleRepository,
  ) {}

  public addCompany(entry: CompanyEntry): bigint {
    try {
      const lastID = this.companyRepo.add(entry);
      return lastID;
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError("company with same name exists");
        } else if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError("some fields are not filled in");
        } else if (err.type == StorageErrorType.FOREIGN_KEY) {
          throw new InvalidFieldError(err.message);
        }
      }
      throw err;
    }
  }

  public getCompanyDTOByID(id: number): CompanyDTO {
    const entry = this.companyRepo.getDTOByID(id);
    if (!entry) {
      throw new NotFoundError("company not found");
    }
    return entry;
  }

  public getAllCompanies(): CompanyEntry[] {
    const entries = this.companyRepo.getAll();
    return entries ?? [];
  }

  public updateCompanyByID(id: number, updates: any) {
    const entry = this.companyRepo.getByID(id);
    if (!entry) {
      throw new NotFoundError("company not found");
    }

    const updated: CompanyEntry = {
      name: updates.name ?? entry.name,
      logo: updates.logo ?? entry.logo,
      baggage_rule_id: updates.baggage_rule_id ?? entry.baggage_rule_id,
    };

    try {
      this.companyRepo.update(id, updated);
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.UNIQUE) {
          throw new NotUniqueError("company with same name exists");
        }
      }
      throw err;
    }
  }

  public removeCompanyByID(id: number) {
    try {
      const changes = this.companyRepo.removeByID(id);
      if (!changes) {
        throw new NotFoundError("company not found");
      }
    } catch (err) {
      if (err instanceof StorageError) {
        if (
          err.type == StorageErrorType.CHECK ||
          err.type == StorageErrorType.FOREIGN_KEY
        ) {
          throw new RelatedDataError(
            "this company entry linked with another entity",
          );
        }
      }
      throw err;
    }
  }

  public addBaggageRule(entry: BaggageRuleEntry): bigint {
    try {
      const lastID = this.baggageRuleRepo.add(entry);
      return lastID;
    } catch (err) {
      if (err instanceof StorageError) {
        if (err.type == StorageErrorType.CHECK) {
          throw new InvalidFieldError("some fields are not filled in");
        }
      }
      throw err;
    }
  }

  public getBaggageRuleByID(id: number): BaggageRuleEntry {
    const entry = this.baggageRuleRepo.getByID(id);
    if (!entry) {
      throw new NotFoundError("baggage rule not found");
    }
    return entry;
  }

  public updateBaggageRuleByID(id: number, updates: any) {
    const entry = this.baggageRuleRepo.getByID(id);
    if (!entry) {
      throw new NotFoundError("baggage rule not found");
    }

    const updated: BaggageRuleEntry = {
      max_free_weight: updates.max_free_weight ?? entry.max_free_weight,
      price_per_kg: updates.price_per_kg ?? entry.price_per_kg,
    };

    this.baggageRuleRepo.update(id, updated);
  }

  public getAllBaggageRules(): BaggageRuleEntry[] {
    const entries = this.baggageRuleRepo.getAll();
    return entries ?? [];
  }

  public removeBaggageRuleByID(id: number) {
    try {
      const changes = this.baggageRuleRepo.removeByID(id);
      if (!changes) {
        throw new NotFoundError("baggage rule not found");
      }
    } catch (err) {
      if (err instanceof StorageError) {
        if (
          err.type == StorageErrorType.CHECK ||
          err.type == StorageErrorType.FOREIGN_KEY
        ) {
          throw new RelatedDataError(
            "this baggage rule entry linked with another entity",
          );
        }
      }
      throw err;
    }
  }
}
