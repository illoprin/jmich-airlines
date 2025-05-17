import { Request } from "express";
import { Roles } from "@/types/repository/user";
import type { Entry } from "@/lib/repository/base.repository";
import { AuthorizationError, ForbiddenError, NotFoundError } from "./errors";

export class AccessControl {
  /**
   * Checks if user has permission to access a specific entity
   * @param userID - ID of user who is trying to get data access
   * @param userRole - Role of user that who is trying to get data access
   * @param entityId - ID of the entity to check access for
   * @param fetchEntityCallback - Function that retrieves the entity from database
   * @returns The requested entity if access is granted
   * @throws {NotFoundError} When entity doesn't exist
   * @throws {ForbiddenError} When access is denied
   */
  public static checkAccess<T extends Entry>(
    userID: number,
    userRole: Roles,
    minRequiredRole: Roles,
    entityId: number,
    fetchEntityCallback: (id: number) => T | null,
  ): T {
    // Fetch the entity from database
    const entity = fetchEntityCallback(entityId);
    if (!entity) {
      throw new NotFoundError("requested entity not found");
    }

    // Grant access if user has sufficient privileges
    if (userRole >= minRequiredRole) {
      console.log("Access control check: Grant access");
      return entity;
    }

    // Check ownership for regular users
    const ownerId = this.getEntityOwnerId(entity);
    console.log(
      "Access control check: ownerID - ",
      ownerId,
      " userID - ",
      userID,
    );
    if (ownerId === userID) {
      return entity;
    }

    throw new ForbiddenError("access denied");
  }

  /**
   * Extracts owner ID from entity using common property names
   * @param entity - The entity to check ownership of
   * @returns The owner's user ID
   * @private
   */
  private static getEntityOwnerId(entity: Entry): number | undefined {
    if ("user_id" in entity) {
      return (entity as { user_id: number }).user_id;
    }
    return undefined;
  }
}
