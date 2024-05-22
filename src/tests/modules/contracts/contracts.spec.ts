import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import mongoose, { Model } from 'mongoose';

import { Contract, ContractsController, ContractsService } from '../../../modules/contracts';
import {
  mockAuthModule,
  mockContractAppendService,
  mockContractorsService,
  allMockContractsService,
  mockIDTypesService,
  mockMaritalStatusService,
  mockOcupationService,
  mockUserService,
} from '../../mocks';
import { ContractAppend, ContractAppendsService } from '../../../modules/contract-appends';
import { Contractor, ContractorsService } from '../../../modules/contractors';
import { User, UsersService } from '../../../modules/users';
import { Ocupation, OcupationsService } from '../../../modules/ocupations';
import { MaritalStatus, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Rol, RolesService } from '../../../modules/roles';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identifications-types';
import { Gender, GendersService } from '../../../modules/genders';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID } from '../../../utils/contants';
import { mockContractsService } from '../../mocks/mockContractsService.mock';

describe('Contract Unit Tests', () => {
  let contractsController: ContractsController;
  let contractService: ContractsService;
  let contractorService: ContractorsService;
  let contractAppendService: ContractAppendsService;
  let userService: UsersService;
  let contractModel: Model<Contract>;
  let respError: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        ContractsService,
        ContractorsService,
        ContractAppendsService,
        UsersService,
        GendersService,
        MaritalStatusesService,
        IdentificationsTypesService,
        OcupationsService,
        RolesService,
        {
          provide: getModelToken(Contract.name),
          useValue: mockContractsService,
        },
        {
          provide: getModelToken(ContractAppend.name),
          useValue: mockContractAppendService,
        },
        {
          provide: getModelToken(Contractor.name),
          useValue: mockContractorsService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
        {
          provide: getModelToken(Rol.name),
          useValue: mockUserService,
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
          useValue: mockIDTypesService,
        },
      ],
      controllers: [ContractsController],
    }).compile();

    contractModel = module.get<Model<Contract>>(getModelToken(Contract.name));
    contractsController = module.get<ContractsController>(ContractsController);
    contractService = module.get<ContractsService>(ContractsService);
    contractorService = module.get<ContractorsService>(ContractorsService);
    contractAppendService = module.get<ContractAppendsService>(ContractAppendsService);
    userService = module.get<UsersService>(UsersService);

    jest.mock('./../../../common/decorators/auth.decorator.ts', () => {
      return {
        AuthModule: {
          forRootAsync: jest.fn().mockImplementation(() => mockAuthModule),
        },
        PassportModule: {
          forRootAsync: jest.fn().mockImplementation(() => mockAuthModule),
        },
      };
    });

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockUserService.mockOneUser as any);
    jest.spyOn(contractorService, 'findOne').mockResolvedValue(mockContractorsService.mockOneContractor as any);
    jest
      .spyOn(contractAppendService, 'findOne')
      .mockResolvedValue(mockContractAppendService.mockOneContractAppend as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Get  Contracts', () => {
    it('1.1 Controller.Get must return a list of all existing contracts', async () => {
      jest.spyOn(contractModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    limit: () => ({
                      skip: () => ({
                        sort: () => ({
                          select: jest.fn().mockResolvedValue([allMockContractsService.mockAllContracts] as any),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await contractService.findAll({});

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockContractsService.find).toHaveBeenCalledTimes(1);
    });

    it('1.2 Controller.get should return a handled error', async () => {
      jest.spyOn(contractModel, 'find').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    limit: () => ({
                      skip: () => ({
                        sort: () => ({
                          select: jest.fn().mockResolvedValue(null),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          } as any),
      );

      try {
        await contractsController.findAll({});
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.findAll).rejects.toThrow(InternalServerErrorException);
      expect(respError).toBeDefined();
    });
  });

  describe('2. Find Contract by ID tests', () => {
    it('2.1 Controller.FindOne should return one existing contract', async () => {
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await contractService.findOne(allMockContractsService.mockOneContract.data.id);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(contractModel.findById).toHaveBeenCalledWith(allMockContractsService.mockOneContract.data.id);
      expect(mockContractsService.findById).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual(allMockContractsService.mockOneContract);

      jest.spyOn(contractModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.2 Controller.FindOne should return a BadRequestException when the contract id is invalid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      const id = 'wrong_Id01';

      try {
        await contractService.findOne(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.findOne(id)).rejects.toThrow(BadRequestException);
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_ID);
      expect(mockContractsService.findById).toHaveBeenCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(contractModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.3 Controller.FindOne should return a NotFoundException when the contract id is not found', async () => {
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

      const id = allMockContractsService.mockOneContract.data.id;

      try {
        await contractsController.findOne(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
      expect(mockContractsService.findById).toHaveBeenCalledTimes(2);

      jest.spyOn(contractModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('3. Create Rol Tests', () => {
    it('3.1- Controller.create should return a new contract created', async () => {
      jest.spyOn(contractModel, 'create').mockResolvedValue(allMockContractsService.mockOneContract as any);

      const resp = await contractService.create(allMockContractsService.mockCreatedContract as any);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockContractsService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(contractModel, 'create').mockClear();
    });

    it('3.2- Controller.create should throw an unhandled error', async () => {
      jest.spyOn(contractModel, 'create').mockRejectedValue(null);

      try {
        await contractsController.create({ name: 'ANY' } as any);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.create({ name: 'ANY' } as any)).rejects.toThrow();
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);
    });
  });

  describe('4- Patch Contract Tests', () => {
    it('4.1- Controller.update should return one updated contract', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await contractService.update(allMockContractsService.mockOneContract.data.id, {
        contractUrl: 'testing',
      });

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(contractModel.findById).toHaveBeenCalledWith(allMockContractsService.mockOneContract.data.id);
      expect(allMockContractsService.mockContractsService.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual(allMockContractsService.mockOneContract);

      jest.spyOn(contractModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(contractModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('4.2 controller.update must return a bad request by invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      const id = 'lkncds93';

      try {
        await contractService.update(id, {});
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.update(id, {})).rejects.toThrow(BadRequestException);
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockContractsService.findByIdAndUpdate).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.3 controller.update must return a not found error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = allMockContractsService.mockOneContract.data.id;

      try {
        await contractsController.update(id, {});
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.update(id, {})).rejects.toThrow(NotFoundException);
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockContractsService.findByIdAndUpdate).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(contractModel, 'findById').mockClear();
    });

    it('4.4 controller.update must return InternalServerErrorException by invalid data', async () => {
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockRejectedValue(false),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = allMockContractsService.mockOneContract.data.id;

      try {
        await contractsController.update(id, {});
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.update(id, {})).rejects.toThrow(InternalServerErrorException);
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockContractsService.findByIdAndUpdate).toHaveBeenCalledTimes(2);

      jest.spyOn(contractModel, 'findById').mockClear();
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.5 controller.update must return a general error', async () => {
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      const id = allMockContractsService.mockOneContract.data.id;

      try {
        await contractsController.update(id, {});
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.update(id, {})).rejects.toThrow(InternalServerErrorException);
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(contractModel, 'findById').mockClear();
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockClear();
    });
  });

  describe('5- Delete Contract Tests', () => {
    it('5.1- Controller.remove should return one removed contract', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest
        .spyOn(contractModel, 'findByIdAndDelete')
        .mockResolvedValue(allMockContractsService.mockOneContract.data.id as any);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await contractsController.remove(allMockContractsService.mockOneContract.data.id);

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockContractsService.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(resp?.data).toEqual({ id: allMockContractsService.mockOneContract.data.id });

      jest.spyOn(contractModel, 'findByIdAndDelete').mockClear();
      jest.spyOn(contractModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('5.2- Controller.remove should return a NotFoundException when the contract id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(null),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = allMockContractsService.mockOneContract.data.id;
      let respError: any = {};

      try {
        await contractsController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.remove(id)).rejects.toThrow(NotFoundException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
      expect(mockContractsService.deleteOne).toHaveBeenCalledTimes(0);

      jest.spyOn(contractModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(contractModel, 'findById').mockClear();
      jest.spyOn(contractModel, 'deleteOne').mockClear();
      jest.clearAllMocks();
    });

    it('5.3- Controller.remove should return a BadRequestException when the contract id is invalid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(contractModel, 'findByIdAndUpdate').mockResolvedValue(false);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(false),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const id = 'wrong-id2';
      let respError: any = {};

      try {
        await contractsController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.remove(id)).rejects.toThrow(BadRequestException);
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(ERR_MSG_INVALID_ID);
      expect(mockContractsService.deleteOne).toHaveBeenCalledTimes(0);

      jest.spyOn(contractModel, 'findByIdAndUpdate').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(contractModel, 'deleteOne').mockClear();
      jest.clearAllMocks();
    });

    it('5.4- Controller.remove should return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(contractModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              populate: () => ({
                populate: () => ({
                  populate: () => ({
                    select: jest.fn().mockResolvedValue(allMockContractsService.mockOneContract),
                  }),
                }),
              }),
            }),
          } as any),
      );
      jest.spyOn(contractModel, 'findByIdAndDelete').mockRejectedValue(null);

      const id = allMockContractsService.mockOneContract.data.id;
      let respError: any = {};

      try {
        await contractsController.remove(id);
      } catch (error) {
        respError = { ...error };
      }

      await expect(contractService.remove(id)).rejects.toThrow();
      expect(respError?.response).toBeDefined();
      expect(respError?.response.success).toBeFalsy();
      expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);

      jest.spyOn(contractModel, 'findByIdAndDelete').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(contractModel, 'findByIdAndDelete').mockClear();
      jest.clearAllMocks();
    });
  });
});
