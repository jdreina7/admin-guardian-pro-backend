import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { ERR_USER_NOT_EXIST_IN_REQUEST } from 'src/utils/contants';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException(ERR_USER_NOT_EXIST_IN_REQUEST);
  }

  return !data ? user : user[data];
});
