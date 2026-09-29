import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../schemas/user.schema.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class TeamAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Користувач не авторизований');
    }

    // System Admin has unrestricted access
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // If roles are specified, check if user has one of them
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('У вас немає прав для виконання цієї дії');
      }
    }

    // Must have a teamId to access team resources (except if admin)
    // We assume the route is team-specific, so they must belong to a team.
    if (!user.teamId) {
      throw new ForbiddenException('Ви не є учасником жодної команди');
    }

    return true;
  }
}
