import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';

import { User } from '../../../modules/users/schemas/user.schema';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ERR_MSG_INACTIVE_USER, ERR_MSG_INVALID_TOKEN } from '../../../utils/contants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>, configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userModel.findOne({ email }).populate('roleId', 'name');

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: ERR_MSG_INVALID_TOKEN,
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: ERR_MSG_INACTIVE_USER,
      });
    }

    return user;
  }
}
