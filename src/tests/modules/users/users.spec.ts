import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';

import { User } from '../../../modules/users/schemas/user.schema';
import { UsersController } from '../../../modules/users/users.controller';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import { UsersService } from '../../../modules/users/users.service';
import { mockAllUsers, mockOneUser, mockUserService, userCreated } from '../../../tests/mocks/mockUsersService.mock';
import { LoginService } from '../../../modules/users/login.service';
import { MaritalStatusesService } from '../../../modules/marital-statuses/marital-statuses.service';
import { MaritalStatus } from '../../../modules/marital-statuses/schemas/marital-status.schema';
import { mockMaritalStatusService, mockOneMaritalStatus } from '../../mocks/mockMaritalStatus.mock';
import { RolesService } from '../../../modules/roles/roles.service';
import { Rol } from '../../../modules/roles/schemas/role.schema';
import { mockRol, mockRolService } from '../../mocks/mockRolesService.mock';
import { OcupationsService } from '../../../modules/ocupations/ocupations.service';
import { Ocupation } from '../../../modules/ocupations/schemas/ocupation.schema';
import { IdentificationTypes } from '../../../modules/identificationsTypes/schemas/identificationTypes.schema';
import { IdentificationsTypesService } from '../../../modules/identificationsTypes/identificationTypes.service';
import { GendersService } from '../../../modules/genders/genders.service';
import { Gender } from '../../../modules/genders/schemas/gender.schema';
import { mockOcupationService, mockOneOcupation } from '../../mocks/mockOcupationService.mock';
import { mockIDTypesService, mockOneIDTypes } from '../../mocks/mockIDtypesService.mock';
import { mockGenderService, mockOneGender } from '../../mocks/mockGenderService.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_UID,
} from '../../../utils/contants';
import * as utils from '../../../utils/utils';

describe('User Unit Testing', () => {
  let usrController: UsersController;
  let usrService: UsersService;
  let usrModel: Model<User>;
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

  describe('1. Get  All Users', () => {
    it('1.1 Controller.Get must return a list of all existing users', async () => {
      jest.spyOn(usrModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: () => ({
                      limit: () => ({
                        skip: () => ({
                          sort: jest.fn().mockResolvedValue([mockAllUsers]),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await usrController.findAll({ limit: 10, offset: 0 });

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockUserService.find).toHaveBeenCalledTimes(1);
    });

    it('1.2 Controller.get should return a handled error', async () => {
      jest.spyOn(usrModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: () => ({
                      limit: () => ({
                        skip: () => ({
                          sort: jest.fn().mockResolvedValue(null),
                        }),
                      }),
                    }),
                  }),
                }),
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

      await expect(usrService.findAll).rejects.toThrow(InternalServerErrorException);
      expect(errorResult).toBeDefined();
    });
  });

  describe('2. Find One User by ID tests', () => {
    it('2.1 Controller.FindOne should return one existing user', async () => {
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(mockOneUser),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await usrController.findOne(mockOneUser.data.id);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(usrModel.findById).toHaveBeenCalledWith(mockOneUser.data.id);
      expect(mockUserService.findById).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual(mockOneUser);

      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.2 Controller.FindOne should return a BadRequestException when the user id is invalid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      const id = 'wrong_Id01';
      let respError: any = {};

      try {
        await usrController.findOne(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.findOne(id)).rejects.toThrow(BadRequestException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_ID);
      expect(mockUserService.findById).toHaveBeenCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.3 Controller.FindOne should return a NotFoundException when the user id is not found', async () => {
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

      const id = mockOneUser.data.id;
      let respError: any = {};

      try {
        await usrController.findOne(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
      expect(mockUserService.findById).toHaveBeenCalledTimes(2);

      jest.spyOn(usrModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('3. Create User Tests', () => {
    it('3.1- Controller.create should return a new user created', async () => {
      jest.spyOn(usrModel, 'create').mockResolvedValue(mockOneUser as any);

      const resp = await usrController.create(userCreated as any);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockUserService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(usrModel, 'create').mockClear();
    });

    it('3.2- Controller.create should return a new user created', async () => {
      jest.spyOn(usrModel, 'create').mockResolvedValue(mockOneUser as any);

      delete userCreated.genderId;
      delete userCreated.maritalStatusId;
      delete userCreated.ocupationId;
      delete userCreated.roleId;
      delete userCreated.identificationTypeId;
      userCreated.middleName = '';

      const resp = await usrController.create(userCreated as any);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockUserService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(usrModel, 'create').mockClear();
    });

    it('3.3- Controller.create should return a BadRequestException when the UID is invalid', async () => {
      jest.spyOn(usrModel, 'create').mockResolvedValue(mockOneUser as any);
      jest.spyOn(utils, 'validateUID').mockResolvedValue(false);

      let respError: any = {};

      try {
        await usrController.create(userCreated as any);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.create(userCreated as any)).rejects.toThrow(BadRequestException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_UID);
      expect(mockUserService.findById).toHaveBeenCalledTimes(0);
    });

    it('3.4- Controller.create should throw an unhandled error', async () => {
      jest.spyOn(usrModel, 'create').mockRejectedValue(null);
      jest.spyOn(utils, 'validateUID').mockResolvedValue(true);

      let respError: any = {};

      try {
        await usrController.create(userCreated as any);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.create({ name: 'ANY' } as any)).rejects.toThrow();
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);
    });
  });

  describe('4- Patch User Tests', () => {
    it('4.1- Controller.update should return one updated user', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(mockOneUser),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(usrModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneUser),
          } as any),
      );

      const resp = await usrController.update(mockOneUser.data.id, {
        firstName: 'Test',
        middleName: 'Test',
        lastName: 'Lopez',
        password: 'Hola123',
        identificationTypeId: '64fcb898da86b3322ddd5f13',
        genderId: '64fcb828b8224d148e5ea6e6',
        maritalStatusId: '64fcc2756e45b152a7cd25cd',
        ocupationId: '64fafe1cc85af4d2f85625bc',
        roleId: '64fa2777f3e9b81d46a2339b',
      });

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(usrModel.findById).toHaveBeenCalledWith(mockOneUser.data.id);
      expect(mockUserService.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual(mockOneUser);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('4.2- Controller.update should return a NotFoundException when the user id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = mockOneUser.data.id;
      let respError: any = {};

      try {
        await usrController.update(id, { status: false });
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.update(id, { status: false })).rejects.toThrow(NotFoundException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
      expect(mockUserService.findById).toHaveBeenCalledTimes(2);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('4.3- Controller.update should return a BadRequestException when the user id is invalid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(usrModel, 'findByIdAndUpdate').mockResolvedValue(false);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = 'wring-id';
      let respError: any = {};

      try {
        await usrController.update(id, { status: false });
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.update(id, { status: false })).rejects.toThrow(BadRequestException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_ID);
      expect(mockUserService.findById).toHaveBeenCalledTimes(0);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('4.4- Controller.update should return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(true),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(usrModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      const id = mockOneUser.data.id;
      let respError: any = {};

      try {
        await usrController.update(id, { status: false });
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.update(id, { status: false })).rejects.toThrow();
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('5- Delete User Tests', () => {
    it('5.1- Controller.remove should return one removed user', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findByIdAndDelete').mockResolvedValue(mockOneUser.data.id as any);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(mockOneUser),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await usrController.remove(mockOneUser.data.id);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockUserService.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual(mockOneUser.data.id);

      jest.spyOn(usrModel, 'findByIdAndDelete').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('5.2- Controller.remove should return a NotFoundException when the user id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = mockOneUser.data.id;
      let respError: any = {};

      try {
        await usrController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.remove(id)).rejects.toThrow(NotFoundException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
      expect(mockUserService.deleteOne).toHaveBeenCalledTimes(0);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(usrModel, 'findById').mockClear();
      jest.spyOn(usrModel, 'deleteOne').mockClear();
      jest.clearAllMocks();
    });

    it('5.3- Controller.remove should return a BadRequestException when the user id is invalid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(usrModel, 'findByIdAndUpdate').mockResolvedValue(false);
      jest.spyOn(usrModel, 'findById').mockResolvedValue(false);

      const id = 'wrong-id2';
      let respError: any = {};

      try {
        await usrController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.remove(id)).rejects.toThrow(BadRequestException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_ID);
      expect(mockUserService.deleteOne).toHaveBeenCalledTimes(0);

      jest.spyOn(usrModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(usrModel, 'deleteOne').mockClear();
      jest.clearAllMocks();
    });

    it('5.4- Controller.remove should return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(usrModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    populate: jest.fn().mockResolvedValue(true),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(usrModel, 'findByIdAndDelete').mockRejectedValue(null);

      const id = mockOneUser.data.id;
      let respError: any = {};

      try {
        await usrController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(usrService.remove(id)).rejects.toThrow();
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);

      jest.spyOn(usrModel, 'findByIdAndDelete').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(usrModel, 'findByIdAndDelete').mockClear();
      jest.clearAllMocks();
    });
  });
});
