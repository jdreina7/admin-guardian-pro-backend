import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { ERR_MSG_INVALID_LOGIN } from 'src/utils/contants';
import { comparePasswords } from 'src/utils/password-manager';

@Injectable()
export class LoginService {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const dbUser: User = await this.userModel.findOne({ email }).select({ email: true, password: true });

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

    return dbUser;
  }
}
