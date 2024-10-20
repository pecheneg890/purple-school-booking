import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Roles } from '../user/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//расширяем auth guard по jwt токену
export class RolesGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		//получение роли из декоратора
		const requiredRole = this.reflector.getAllAndOverride<Roles>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRole) {
			return true;
		}

		//проверка JWT токена
		const auth = await super.canActivate(context);
		if (!auth) return auth;

		//сверка роли в декораторе и роли из JWT токена
		const { user } = context.switchToHttp().getRequest();

		return requiredRole === user.role || user.role === Roles.admin;
	}
}
