import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import mongoose, { Model } from 'mongoose';

import { Contractor, ContractorsController, ContractorsService } from '../../../modules/contractors';
import { LoginService, User, UsersService } from '../../../modules/users';
import { mockContractorsService, mockUserService } from '../../../tests/mocks';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  createdContractor,
  mockAllContractors,
  mockOneContractor,
} from '../../../tests/mocks/mockContractorsService.mock';
import { mockOneUser } from '../../../tests/mocks/mockUsersService.mock';
import { DocumentType, DocumentTypesService } from '../../../modules/document-types';
import { MaritalStatus, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Rol, RolesService } from '../../../modules/roles';
import { Ocupation, OcupationsService } from '../../../modules/ocupations';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identificationsTypes';
import { Gender, GendersService } from '../../../modules/genders';
import { mockDocumentTypeService, mockOneDocType } from '../../../tests/mocks/mockDocumentTypeService.mock';
import { mockMaritalStatusService, mockOneMaritalStatus } from '../../../tests/mocks/mockMaritalStatus.mock';
import { mockRol, mockRolService } from '../../../tests/mocks/mockRolesService.mock';
import { mockOcupationService, mockOneOcupation } from '../../../tests/mocks/mockOcupationService.mock';
import { mockIDTypesService, mockOneIDTypes } from '../../../tests/mocks/mockIDtypesService.mock';
import { mockGenderService, mockOneGender } from '../../../tests/mocks/mockGenderService.mock';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_INVALID_ID } from '../../../utils/contants';

describe('Contractors Module Test', () => {
  let contractorsController: ContractorsController;
  let contractorsService: ContractorsService;
  let contractorsModel: Model<Contractor>;

  let docTypeService: DocumentTypesService;
  let maritalStatusesService: MaritalStatusesService;
  let rolesService: RolesService;
  let ocupationsService: OcupationsService;
  let identificationsTypesService: IdentificationsTypesService;
  let gendersService: GendersService;
  let userModel: Model<User>;
  let userService: UsersService;
  let { id } = mockOneContractor.data;
  let result: any = {};
  let errorResult: any = {};

  beforeEach(async () => {
    const contractorsModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginService,
        JwtService,
        ContractorsService,
        UsersService,

        DocumentTypesService,
        MaritalStatusesService,
        RolesService,
        OcupationsService,
        IdentificationsTypesService,
        GendersService,
        {
          provide: getModelToken(Contractor.name),
          useValue: mockContractorsService.mockContractorsService,
        },
        {
          provide: getModelToken(DocumentType.name),
          useValue: mockDocumentTypeService,
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
      controllers: [ContractorsController],
    }).compile();

    contractorsController = contractorsModule.get<ContractorsController>(ContractorsController);
    contractorsService = contractorsModule.get<ContractorsService>(ContractorsService);
    contractorsModel = contractorsModule.get<Model<Contractor>>(getModelToken(Contractor.name));

    userModel = contractorsModule.get<Model<User>>(getModelToken(User.name));
    userService = contractorsModule.get<UsersService>(UsersService);
    maritalStatusesService = contractorsModule.get<MaritalStatusesService>(MaritalStatusesService);
    rolesService = contractorsModule.get<RolesService>(RolesService);
    ocupationsService = contractorsModule.get<OcupationsService>(OcupationsService);
    identificationsTypesService = contractorsModule.get<IdentificationsTypesService>(IdentificationsTypesService);
    gendersService = contractorsModule.get<GendersService>(GendersService);
    docTypeService = contractorsModule.get<DocumentTypesService>(DocumentTypesService);

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
    jest.spyOn(docTypeService, 'findOne').mockResolvedValue(mockOneDocType as any);
    jest.spyOn(maritalStatusesService, 'findOne').mockResolvedValue(mockOneMaritalStatus as any);
    jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRol as any);
    jest.spyOn(ocupationsService, 'findOne').mockResolvedValue(mockOneOcupation as any);
    jest.spyOn(identificationsTypesService, 'findOne').mockResolvedValue(mockOneIDTypes as any);
    jest.spyOn(gendersService, 'findOne').mockResolvedValue(mockOneGender as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Test create Contractor', () => {
    it('1.1 Controller.Create must return a new Contractor created', async () => {
      jest.spyOn(contractorsModel, 'create').mockResolvedValue(mockOneContractor as any);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

      result = await contractorsController.create(createdContractor as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractor);
      expect(mockContractorsService.mockContractorsService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(contractorsModel, 'create').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('1.2 Controller.Create must return a Custom handled error', async () => {
      jest.spyOn(contractorsModel, 'create').mockRejectedValue(null);

      try {
        await contractorsController.create({ name: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(contractorsService.create({ name: 'ANY' } as any)).rejects.toThrow();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
    });
  });

  describe('2. Test Get one contractor by Id', () => {
    it('2.1 controller.get must return return the existing contractor', async () => {
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );
      result = await contractorsController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractor);
      expect(mockContractorsService.mockContractorsService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(contractorsModel, 'findById').mockClear();
    });

    it('2.2 controller.get must return a badRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'mo23njb4a';

      try {
        await contractorsController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(contractorsService.findOne(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockContractorsService.mockContractorsService.findById).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('2.3 controller.get must return not found error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(null),
          } as any),
      );

      id = 'mo2';

      try {
        await contractorsController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(contractorsService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockContractorsService.mockContractorsService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(contractorsModel, 'findById').mockClear();
    });
  });

  describe('3. Test Get all contractors', () => {
    it('3.1 Controller.get must return all existing contractors', async () => {
      jest.spyOn(contractorsModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              sort: jest.fn().mockResolvedValue(mockAllContractors),
            }),
          } as any),
      );

      result = await contractorsController.findAll();

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();

      jest.spyOn(contractorsModel, 'find').mockClear();
    });
  });

  describe('4. Test update one contractor', () => {
    it('4.1 Controller.update must return the seeked contractor with its new changes', async () => {
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );
      jest.spyOn(contractorsModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );

      result = await contractorsService.update(id, { status: false });

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toEqual(mockOneContractor);

      jest.spyOn(contractorsModel, 'findById').mockClear();
      jest.spyOn(contractorsModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.2 Controller.update must return a general error', async () => {
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );
      jest.spyOn(contractorsModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await contractorsController.update(id, {});
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(contractorsService.update(id, {})).rejects.toThrow(InternalServerErrorException);
      expect(errorResult).toBeDefined();
      expect(errorResult?.success).toBeFalsy();
    });
  });

  describe('5. Test remove one contractor', () => {
    it('4.1 Controller.remoce must return the deleted id contractor', async () => {
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );
      jest.spyOn(contractorsModel, 'findByIdAndDelete').mockResolvedValue(id);

      result = await contractorsService.remove(id);

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toEqual(id);

      jest.spyOn(contractorsModel, 'findById').mockClear();
      jest.spyOn(contractorsModel, 'findByIdAndDelete').mockClear();
    });

    it('4.2 Controller.remove must return a general error', async () => {
      jest.spyOn(contractorsModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockResolvedValue(mockOneContractor),
          } as any),
      );
      jest.spyOn(contractorsModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await contractorsController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(contractorsService.remove(id)).rejects.toThrow();
      expect(errorResult).toBeDefined();
      expect(errorResult?.success).toBeFalsy();
    });
  });
});
