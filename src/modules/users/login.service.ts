import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';
import { ERR_MSG_INVALID_LOGIN } from './../../utils/contants';
import { comparePasswords } from './../../utils/password-manager';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { RolesService } from '../roles';

@Injectable()
export class LoginService {
  constructor(
    // Models
    @InjectModel(User.name) private readonly userModel: Model<User>,
    // Services
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(RolesService) private readonly roleService: RolesService,
  ) {}

  // User login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // const dbUser: User = await this.userModel.findOne({ email }).select({ email: true, password: true, roleId: true });
    const dbUser: User = await this.userModel.findOne({ email });

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

    // Getting the role name
    const role = await this.roleService.findOne(String(dbUser?.roleId));

    delete dbUser?.settings?.id;
    delete dbUser?.settings?._id;

    if (Object.keys(dbUser?.settings).length === 0) {
      dbUser.settings = {
        layout: {},
        theme: {},
      };
    }

    return {
      user: {
        uid: dbUser?.id,
        role: role?.data?.name,
        data: {
          displayName: dbUser?.username ? dbUser?.username : `${dbUser?.firstName} ${dbUser?.lastName}`,
          photoURL: dbUser?.userImg ? dbUser?.userImg : '',
          email: dbUser?.email,
          settings: dbUser?.settings,
          shortcuts: dbUser?.shortcuts,
          loginRedirectUrl: dbUser?.loginRedirectUrl,
        },
      },
      access_token: this.getJwtToken({ id: dbUser.id, email: dbUser.email }),
    };

    // return {
    //   id: dbUser?._doc?._id,
    //   email: dbUser?._doc?.email,
    //   role: role?.data?.name,
    //   token: this.getJwtToken({ id: dbUser.id, email: dbUser.email }),
    // };
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
