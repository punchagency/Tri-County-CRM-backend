import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/**
 * Decorator to mark endpoints as public (no authentication required)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Decorator to specify required roles for an endpoint
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
