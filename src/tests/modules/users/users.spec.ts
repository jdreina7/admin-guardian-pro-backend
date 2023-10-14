import { BadRequestException, forwardRef } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { LoginModule } from '../../../modules/login/login.module';
import { User } from '../../../modules/users/schemas/user.schema';
import { UsersController } from '../../../modules/users/users.controller';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import { UsersService } from '../../../modules/users/users.service';
import { mockAllUsers, mockUserService } from '../../../tests/mocks/mockUsersService.mock';
import { GendersModule } from '../../../modules/genders/genders.module';
import { IdentificationsTypesModule } from '../../../modules/identificationsTypes/identificationTypes.module';
import { MaritalStatusesModule } from '../../../modules/marital-statuses/marital-statuses.module';
import { OcupationsModule } from '../../../modules/ocupations/ocupations.module';
import { RolesModule } from '../../../modules/roles/roles.module';
import { UsersModule } from '../../../modules/users/users.module';

describe('User Unit Testing', () => {
  let usrController: UsersController;
  let usrService: UsersService;
  let usrModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        forwardRef(() => UsersModule),
        forwardRef(() => LoginModule),
        MaritalStatusesModule,
        OcupationsModule,
        RolesModule,
        GendersModule,
        IdentificationsTypesModule,
        UsersService,
      ],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
      controllers: [UsersController],
    }).compile();

    usrController = module.get<UsersController>(UsersController);
    usrService = module.get<UsersService>(UsersService);
    usrModel = module.get<Model<User>>(getModelToken(User.name));

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
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Get  All Users', () => {
    it('1.1 Controller.Get must return a list of all existing users', async () => {
      jest.spyOn(usrModel, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: () => ({
                sort: jest.fn().mockResolvedValue([mockAllUsers]),
              }),
            }),
          } as any),
      );

      const resp = await usrController.findAll({});

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockUserService.find).toHaveBeenCalledTimes(1);
    });

    it('1.2 Controller.get should return a handled error', async () => {
      jest.spyOn(usrModel, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: () => ({
                sort: jest.fn().mockResolvedValue(null),
              }),
            }),
          } as any),
      );

      let errorResult: any = {};

      try {
        await usrController.findAll({});
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(usrService.findAll).rejects.toThrow(BadRequestException);
      expect(errorResult).toBeDefined();
    });
  });
});
