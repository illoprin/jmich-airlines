import { Request } from "express";
import { Roles } from "../../types/user.type";
import type { Entry } from "../repository/base.repository";
import {
	AuthorizationError,
	ForbiddenError,
	NotFoundError,
} from "../../types/service.type";

export class AccessControl {
	/**
	 * Checks if user has permission to access a specific entity
	 * @param req - Express request object with authenticated user
	 * @param minRequiredRole - Minimum role needed for unrestricted access
	 * @param entityId - ID of the entity to check access for
	 * @param fetchEntityCallback - Function that retrieves the entity from database
	 * @returns The requested entity if access is granted
	 * @throws {NotFoundError} When entity doesn't exist
	 * @throws {ForbiddenError} When access is denied
	 */
	public static checkAccess<T extends Entry>(
		req: Request,
		minRequiredRole: Roles,
		entityId: number,
		fetchEntityCallback: (id: number) => T | null
	): T {
		// Validate authenticated user
		if (!req.token_data) {
			throw new AuthorizationError("authentication required");
		}

		const { id: userId, role: userRole } = req.token_data;

		// Fetch the entity from database
		const entity = fetchEntityCallback(entityId);
		if (!entity) {
			throw new NotFoundError("requested entity not found")
		}

		// Grant access if user has sufficient privileges
		if (minRequiredRole >= userRole) {
			return entity;
		}

		// Check ownership for regular users
		const ownerId = this.getEntityOwnerId(entity);
		if (ownerId === userId) {
			return entity;
		}

		throw new ForbiddenError("protected data");
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
