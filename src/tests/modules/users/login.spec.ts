import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { User, LoginService, UsersController, UsersService } from '../../../modules/users';
import { usrLogin } from '../../mocks/mockLoginService.mock';
import { mockOneUser } from '../../mocks/mockUsersService.mock';
import * as passManager from '../../../utils/password-manager';

describe('Login Unit Tests', () => {
  let usrController: UsersController;
  let usrModel: Model<User>;
  let loginService: LoginService;

  let usrService: UsersService;
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
        LoginService,
        JwtService,
        MaritalStatusesService,
        RolesService,
        OcupationsService,
        IdentificationsTypesService,
        GendersService,
        {
          provide: getModelToken(MaritalStatus.name),
          useValue: mockMaritalStatusService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
        {
          provide: getModelToken(Rol.name),
          useValue: mockRolService,
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
      controllers: [UsersController],
    }).compile();

    usrController = module.get<UsersController>(UsersController);
    usrService = module.get<UsersService>(UsersService);
    usrModel = module.get<Model<User>>(getModelToken(User.name));
    maritalStatusesService = module.get<MaritalStatusesService>(MaritalStatusesService);
    rolesService = module.get<RolesService>(RolesService);
    ocupationsService = module.get<OcupationsService>(OcupationsService);
    identificationsTypesService = module.get<IdentificationsTypesService>(IdentificationsTypesService);
    gendersService = module.get<GendersService>(GendersService);

    jest.mock('./../../../common/decorators/auth.decorator.ts', () => {
      return {
        AuthModule: {
          forRootAsync: jest.fn().mockImplementation(() => MockAuthModule),
        },
        PassportModule: {
          forRootAsync: jest.fn().mockImplementation(() => MockAuthModule),
        },
      };
    });

    jest.spyOn(maritalStatusesService, 'findOne').mockResolvedValue(mockOneMaritalStatus as any);
    jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRol as any);
    jest.spyOn(ocupationsService, 'findOne').mockResolvedValue(mockOneOcupation as any);
    jest.spyOn(identificationsTypesService, 'findOne').mockResolvedValue(mockOneIDTypes as any);
    jest.spyOn(gendersService, 'findOne').mockResolvedValue(mockOneGender as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('1- Login should return a succes login', async () => {
    // jest.spyOn(usrModel, 'findOne').mockResolvedValue(mockOneUser as any);
    jest.spyOn(usrModel, 'findOne').mockImplementation(
      () =>
        ({
          select: jest.fn().mockResolvedValue(mockOneUser),
        } as any),
    );
    jest.spyOn(passManager, 'comparePasswords').mockResolvedValue(true);

    const resp = await usrController.login(usrLogin);

    expect(resp).toBeDefined();
    expect(resp?._id).toBeDefined();
    expect(resp?.token).toBeDefined();
    expect(loginService.login).toHaveBeenCalledTimes(1);
  });
});
