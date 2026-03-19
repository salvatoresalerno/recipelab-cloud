import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentLoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    console.log('user corrente: ', request.user)

    return request.user;
  },
);