import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import mongoose, { Model } from 'mongoose';

import { LoginService, User, UsersService } from '../../../modules/users';
import { mockOneUser, mockUserService } from '../../../tests/mocks/mockUsersService.mock';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  createdContracAppend,
  mockAllContractAppends,
  mockContractAppendsService,
  mockOneContractAppend,
} from './../../mocks/mockContractAppendsService.mock';
import { ContractAppendsController } from './../../../modules/contract-appends/contract-appends.controller';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID } from '../../../utils/contants';
import { ContractAppendsService } from '../../../modules/contract-appends/contract-appends.service';
import { ContractAppend } from '../../../modules/contract-appends/schemas/contract-append.schema';
import { Rol, RolesService } from '../../../modules/roles';
import { MaritalStatus, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Ocupation, OcupationsService } from '../../../modules/ocupations';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identifications-types';
import { Gender, GendersService } from '../../../modules/genders';
import {
  mockGenderService,
  mockIDTypesService,
  mockMaritalStatusService,
  mockOcupationService,
  mockRolService,
} from '../../../tests/mocks';
import { mockOneMaritalStatus } from '../../../tests/mocks/mockMaritalStatus.mock';
import { mockRol } from '../../../tests/mocks/mockRolesService.mock';
import { mockOneOcupation } from '../../../tests/mocks/mockOcupationService.mock';
import { mockOneIDTypes } from '../../../tests/mocks/mockIDtypesService.mock';
import { mockOneGender } from '../../../tests/mocks/mockGenderService.mock';

describe('Contract-Appends module Test', () => {
  let conAppController: ContractAppendsController;
  let conAppServices: ContractAppendsService;
  let conAppModel: Model<ContractAppend>;

  let userService: UsersService;
  let userModel: Model<User>;
  let maritalStatusesService: MaritalStatusesService;
  let rolesService: RolesService;
  let ocupationsService: OcupationsService;
  let identificationsTypesService: IdentificationsTypesService;
  let gendersService: GendersService;

  let { id } = mockOneContractAppend.data[0];
  let result: any = {};
  let errorResult: any = {};

  beforeEach(async () => {
    const conAppModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginService,
        JwtService,
        ContractAppendsService,

        UsersService,
        MaritalStatusesService,
        RolesService,
        OcupationsService,
        IdentificationsTypesService,
        GendersService,

        {
          provide: getModelToken(ContractAppend.name),
          useValue: mockContractAppendsService,
        },
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
      controllers: [ContractAppendsController],
    }).compile();

    conAppController = conAppModule.get<ContractAppendsController>(ContractAppendsController);
    conAppServices = conAppModule.get<ContractAppendsService>(ContractAppendsService);
    conAppModel = conAppModule.get<Model<ContractAppend>>(getModelToken(ContractAppend.name));
    userModel = conAppModule.get<Model<User>>(getModelToken(User.name));
    userService = conAppModule.get<UsersService>(UsersService);

    maritalStatusesService = conAppModule.get<MaritalStatusesService>(MaritalStatusesService);
    rolesService = conAppModule.get<RolesService>(RolesService);
    ocupationsService = conAppModule.get<OcupationsService>(OcupationsService);
    identificationsTypesService = conAppModule.get<IdentificationsTypesService>(IdentificationsTypesService);
    gendersService = conAppModule.get<GendersService>(GendersService);

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

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
    jest.spyOn(maritalStatusesService, 'findOne').mockResolvedValue(mockOneMaritalStatus as any);
    jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRol as any);
    jest.spyOn(ocupationsService, 'findOne').mockResolvedValue(mockOneOcupation as any);
    jest.spyOn(identificationsTypesService, 'findOne').mockResolvedValue(mockOneIDTypes as any);
    jest.spyOn(gendersService, 'findOne').mockResolvedValue(mockOneGender as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Test Create Contract-Append', () => {
    it('1.1 Controller.create must Return a new created Contract-Append', async () => {
      jest.spyOn(conAppModel, 'create').mockResolvedValue(mockOneContractAppend as any);

      result = await conAppController.create(createdContracAppend as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractAppend);
      expect(mockContractAppendsService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(conAppModel, 'create').mockClear();
    });

    it('1.2 Controller.create must Return a general error', async () => {
      jest.spyOn(conAppModel, 'create').mockRejectedValue(null);

      try {
        await conAppController.create({ title: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      jest.spyOn(conAppModel, 'create').mockRejectedValue(null);
    });
  });

  describe('2. Test Get one Contract-Append by Id', () => {
    it('2.1 controller.get must return return the existing Contract-Append', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
      // Porque el mongoose id no se se implemento y no dio el error?
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractAppend),
          } as any),
      );
      result = await conAppController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractAppend);
      expect(mockContractAppendsService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(userService, 'findOne').mockClear();
      jest.spyOn(conAppModel, 'findById').mockClear();
    });

    it('2.2 controller.get must return a badRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'mo23njb4a';

      try {
        await conAppController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.findOne(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockContractAppendsService.findById).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('2.3 controller.get must return not found error', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(null),
          } as any),
      );

      id = 'mo23njb4a';

      try {
        await conAppController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.findOne(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockContractAppendsService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(userService, 'findOne').mockClear();
    });
  });

  describe('3. Test get all existing Contract-Append', () => {
    it('3.1 controller.get must return all existing Contract-Append', async () => {
      jest.spyOn(conAppModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              limit: () => ({
                skip: () => ({
                  sort: jest.fn().mockResolvedValue(mockAllContractAppends.data[0].title),
                }),
              }),
            }),
          } as any),
      );

      result = await conAppController.findAll({ limit: 10, offset: 0 });

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockAllContractAppends.data[0].title);
      expect(mockContractAppendsService.find).toHaveBeenCalled();

      jest.spyOn(conAppModel, 'find').mockClear();
    });
  });

  describe('4. test update Contract-Append by id', () => {
    let data: any = {
      mockOneContractAppend,
      status: false,
    };
    it('4.1 controller.update must return the updated Contract-Append', async () => {
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractAppend),
          } as any),
      );
      jest.spyOn(conAppModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockReturnValue(mockOneContractAppend),
          } as any),
      );

      id = mockOneContractAppend.data[0].id;
      result = await conAppController.update(id, data);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractAppend);
      expect(mockContractAppendsService.findByIdAndUpdate).toHaveBeenCalled();

      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(conAppModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.2 controller.update must return a bad request by invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockReturnValue(false),
          } as any),
      );

      id = '123';

      try {
        await conAppController.update(id, data);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.findOne(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(mockContractAppendsService.findByIdAndUpdate).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(conAppModel, 'findById').mockClear();
    });

    it('4.3 controller.update must return a not found error', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(null),
          } as any),
      );

      id = 'mo23njb4a';
      try {
        await conAppController.update(id, data as any);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.findOne(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(mockContractAppendsService.find).not.toHaveBeenCalled();
      expect(mockContractAppendsService.findByIdAndUpdate).toBeCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(userService, 'findOne').mockClear();
    });

    it('4.4 controller.update must return a general error', async () => {
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: jest.fn().mockResolvedValue(mockOneContractAppend),
            }),
          } as any),
      );
      jest.spyOn(conAppModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      data = { title: 'testing again' };
      try {
        await conAppController.update(id, data);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.update(id, data)).rejects.toThrow(InternalServerErrorException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(conAppModel, 'findByIdAndUpdate').mockClear();
    });
  });

  describe('5. Test delete Contract-Append', () => {
    it('5.1 controller.remove must return the deleted Id', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
      jest.spyOn(conAppModel, 'findByIdAndDelete').mockResolvedValue(id);

      result = await conAppController.remove(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBe(id);
      expect(mockContractAppendsService.findByIdAndDelete).toHaveBeenCalled();

      jest.spyOn(userService, 'findOne').mockClear();
      jest.spyOn(conAppModel, 'findByIdAndDelete').mockClear();
    });

    it('5.2 controller.remove must a bad request by  invalid Id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'lkncds93';

      try {
        await conAppController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockContractAppendsService.findByIdAndDelete).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('5.3 controller.remove must a not found error', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(null),
          } as any),
      );

      id = '6503ef3131e64335e124fd55';

      try {
        await conAppController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.remove(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockContractAppendsService.findByIdAndDelete).not.toHaveBeenCalled();

      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('5.4 controller.remove must a general error', async () => {
      jest.spyOn(conAppModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: jest.fn().mockResolvedValue(mockOneContractAppend),
            }),
          } as any),
      );
      jest.spyOn(conAppModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await conAppController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(conAppServices.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(conAppModel, 'findById').mockClear();
      jest.spyOn(conAppModel, 'findByIdAndDelete').mockClear();
    });
  });
});
