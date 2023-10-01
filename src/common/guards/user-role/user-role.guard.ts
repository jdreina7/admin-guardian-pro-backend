import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ERR_NOT_HAVE_PERMISSIONS_FOR_MODULE, ERR_USER_NOT_EXIST_IN_REQUEST, META_ROLE } from 'src/utils/contants';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLE, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!validRoles || validRoles.length <= 0) {
      return true;
    }

    if (!user) {
      throw new BadRequestException(ERR_USER_NOT_EXIST_IN_REQUEST);
    }

    if (validRoles.includes(user.roleId['name'])) {
      return true;
    }

    throw new ForbiddenException(ERR_NOT_HAVE_PERMISSIONS_FOR_MODULE);
  }
}
