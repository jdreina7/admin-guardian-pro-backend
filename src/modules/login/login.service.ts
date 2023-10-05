import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';
import { ERR_MSG_INVALID_LOGIN } from './../../utils/contants';
import { comparePasswords } from './../../utils/password-manager';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class LoginService {
  constructor(
    // Models
    @InjectModel(User.name) private readonly userModel: Model<User>,
    // Services
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  // User login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const dbUser: any = await this.userModel.findOne({ email }).select({ email: true, password: true });

    if (!dbUser) {
      throw new UnauthorizedException({
        success: false,
        message: ERR_MSG_INVALID_LOGIN,
      });
    }

    // Validar en este punto que existan ambos password?

    const validPassword = await comparePasswords(password, dbUser.password);

    if (!validPassword) {
      throw new UnauthorizedException({
        success: false,
        message: ERR_MSG_INVALID_LOGIN,
      });
    }

    return {
      ...dbUser._doc,
      token: this.getJwtToken({ id: dbUser.id, email: dbUser.email }),
    };
  }

  /**
   * Function for create a new JWT token
   * @param payload The payload for create the JWT token
   * @returns return a valid JWT token
   */
  private getJwtToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }
}
