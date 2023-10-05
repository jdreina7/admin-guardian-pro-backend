import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EValidRoles } from './../../utils/interfaces';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { GetRole } from './../../modules/login/decorators';

export function Auth(...roles: EValidRoles[]) {
  return applyDecorators(GetRole(...roles), UseGuards(AuthGuard(), UserRoleGuard));
}
