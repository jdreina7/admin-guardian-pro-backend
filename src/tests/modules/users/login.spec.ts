import { UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, LoginService, UsersController, UsersService } from '../../../modules/users';
import * as passManager from '../../../utils/password-manager';
import { MaritalStatus, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Rol, RolesService } from '../../../modules/roles';
import { Ocupation, OcupationsService } from '../../../modules/ocupations';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identificationsTypes';
import { Gender, GendersService } from '../../../modules/genders';

import {
  mockMaritalStatusService,
  mockUserService,
  mockRolService,
  mockOcupationService,
  mockIDTypesService,
  mockGenderService,
  mockAuthModule,
  mockLoginService,
} from '../../mocks/index';
import { ERR_MSG_INVALID_LOGIN } from '../../../utils/contants';
import { mockRol } from '../../mocks/mockRolesService.mock';

describe('Login Unit Tests', () => {
  // let usrController: UsersController;
  let usrModel: Model<User>;
  // let roleModel: Model<Rol>;
  let loginService: LoginService;
  let jwtService: JwtService;
  let maritalStatusesService: MaritalStatusesService;
  let rolesService: RolesService;
  let ocupationsService: OcupationsService;
  let identificationsTypesService: IdentificationsTypesService;
  let gendersService: GendersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        UsersService,
        MaritalStatusesService,
        OcupationsService,
        IdentificationsTypesService,
        GendersService,
        LoginService,
        JwtService,
        RolesService,
        {
          provide: getModelToken(User.name),
          useValue: Model, // For test directly models functions
        },
        {
          provide: getModelToken(Rol.name),
          useValue: mockRolService,
        },
        {
          provide: getModelToken(MaritalStatus.name),
          useValue: mockMaritalStatusService,
        },
        {
          provide: getModelToken(Ocupation.name),
          useValue: mockOcupationService,
        },
        {
          provide: getModelToken(IdentificationTypes.name),
          useValue: mockIDTypesService,
        },
        {
          provide: getModelToken(Gender.name),
          useValue: mockGenderService,
        },
      ],
      // controllers: [UsersController],
    }).compile();

    // usrController = module.get<UsersController>(UsersController);
    loginService = module.get<LoginService>(LoginService);
    jwtService = module.get<JwtService>(JwtService);
    maritalStatusesService = module.get<MaritalStatusesService>(MaritalStatusesService);
    rolesService = module.get<RolesService>(RolesService);
    ocupationsService = module.get<OcupationsService>(OcupationsService);
    identificationsTypesService = module.get<IdentificationsTypesService>(IdentificationsTypesService);
    gendersService = module.get<GendersService>(GendersService);
    usrModel = module.get<Model<User>>(getModelToken(User.name));
    //roleModel = module.get<Model<Rol>>(getModelToken(Rol.name));

    jest.mock('./../../../common/decorators/auth.decorator.ts', () => {
      return {
        AuthModule: {
          forRootAsync: jest.fn().mockImplementation(() => mockAuthModule.MockAuthModule),
        },
        PassportModule: {
          forRootAsync: jest.fn().mockImplementation(() => mockAuthModule.MockAuthModule),
        },
      };
    });

    jest
      .spyOn(maritalStatusesService, 'findOne')
      .mockResolvedValue(mockMaritalStatusService.mockOneMaritalStatus as any);
    jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRolService.mockRol as any);
    jest.spyOn(ocupationsService, 'findOne').mockResolvedValue(mockOcupationService.mockOneOcupation as any);
    jest.spyOn(identificationsTypesService, 'findOne').mockResolvedValue(mockIDTypesService.mockOneIDTypes as any);
    jest.spyOn(gendersService, 'findOne').mockResolvedValue(mockGenderService.mockOneGender as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('1- Login should return a success login from controller', async () => {
    jest.spyOn(rolesService, 'findOne').mockReturnValueOnce(mockRol as any);
    jest.spyOn(usrModel, 'findOne').mockImplementation(
      () =>
        ({
          select: jest.fn().mockResolvedValue(mockUserService.mockOneUser),
        } as any),
    );
    jest.spyOn(passManager, 'comparePasswords').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockLoginService.succesLogin.token as any);
    jest.spyOn(loginService, 'login').mockResolvedValue(mockLoginService.succesLogin as any);

    const resp = await loginService.login(mockLoginService.usrLogin);

    expect(resp).toBeDefined();
    expect(resp?.id).toBeDefined();
    expect(resp?.token).toBeDefined();
    expect(loginService.login).toHaveBeenCalledTimes(1);
  });

  // it('1.1- Login should return a success login from controller', async () => {
  //   jest.spyOn(usrModel, 'findOne').mockImplementation(
  //     () =>
  //       ({
  //         select: jest.fn().mockResolvedValue(mockUserService.mockOneUser),
  //       } as any),
  //   );
  //   jest.spyOn(passManager, 'comparePasswords').mockResolvedValue(true);
  //   jest.spyOn(loginService, 'login').mockResolvedValue(mockLoginService.succesLogin as any);
  //   jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockLoginService.succesLogin.token as any);

  //   const resp = await usrController.login(mockLoginService.usrLogin);

  //   expect(resp).toBeDefined();
  //   expect(resp?.id).toBeDefined();
  //   expect(resp?.token).toBeDefined();
  //   expect(loginService.login).toHaveBeenCalledTimes(1);

  //   jest.spyOn(jwtService, 'sign').mockClear();
  //   jest.spyOn(passManager, 'comparePasswords').mockClear();
  //   jest.clearAllMocks();
  // });

  it('2- Login should return a UnauthorizedException because the user not exist', async () => {
    jest.spyOn(usrModel, 'findOne').mockImplementation(
      () =>
        ({
          select: jest.fn().mockResolvedValue(null),
        } as any),
    );

    let respError: any = {};

    try {
      await loginService.login(mockLoginService.usrLogin);
    } catch (error) {
      respError = { ...error };
    }

    await expect(loginService.login(mockLoginService.usrLogin)).rejects.toThrow(UnauthorizedException);

    expect(respError?.response).toBeDefined();
    expect(respError?.response.success).toBeFalsy();
    expect(respError?.response.message).toBe(ERR_MSG_INVALID_LOGIN);

    jest.spyOn(usrModel, 'findById').mockClear();
    jest.spyOn(jwtService, 'sign').mockClear();
    jest.clearAllMocks();
  });

  it('3- Login should return a UnauthorizedException because the password not matchs with the userDb password', async () => {
    jest.spyOn(usrModel, 'findOne').mockImplementation(
      () =>
        ({
          select: jest.fn().mockResolvedValue(mockUserService.mockOneUser.data),
        } as any),
    );
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);
    jest.spyOn(passManager, 'comparePasswords').mockResolvedValue(false);

    let respError: any = {};

    try {
      await loginService.login(mockLoginService.usrLogin);
    } catch (error) {
      respError = { ...error };
    }

    await expect(loginService.login(mockLoginService.usrLogin)).rejects.toThrow(UnauthorizedException);

    expect(respError?.response).toBeDefined();
    expect(respError?.response.success).toBeFalsy();
    expect(respError?.response.message).toBe(ERR_MSG_INVALID_LOGIN);

    jest.spyOn(usrModel, 'findById').mockClear();
    jest.spyOn(jwtService, 'sign').mockClear();
    jest.clearAllMocks();
  });
});
