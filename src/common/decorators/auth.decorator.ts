import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetRole } from 'src/modules/login/decorators/get-role.decorator';
import { EValidRoles } from 'src/utils/interfaces';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: EValidRoles[]) {
  return applyDecorators(GetRole(...roles), UseGuards(AuthGuard(), UserRoleGuard));
}
