import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { ERR_MSG_INVALID_LOGIN } from 'src/utils/contants';
import { comparePasswords } from 'src/utils/password-manager';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    // Models
    @InjectModel(User.name) private readonly userModel: Model<User>,
    // Services
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const dbUser: any = await this.userModel.findOne({ email }).select({ email: true, password: true });

    if (!dbUser) {
      throw new UnauthorizedException({
        success: false,
        message: ERR_MSG_INVALID_LOGIN,
      });
    }

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
