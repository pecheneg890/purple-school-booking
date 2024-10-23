import { SetMetadata } from '@nestjs/common';
import { Roles } from '../user/schemas/user.schema';

export const ROLES_KEY = 'role';
export const Role = (role: Roles) => SetMetadata(ROLES_KEY, role);
