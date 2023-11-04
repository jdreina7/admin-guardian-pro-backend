import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import mongoose, { Model } from 'mongoose';

import { Contract, ContractsController, ContractsService } from '../../../modules/contracts';
import { UsersModule } from '../../../modules/users/users.module';
import {
  mockAuthModule,
  mockContractsService,
  mockIDTypesService,
  mockMaritalStatusService,
  mockOcupationService,
  mockUserService,
} from '../../mocks';
import { ContractAppend, ContractAppendsModule, ContractAppendsService } from '../../../modules/contract-appends';
import { Contractor, ContractorsService } from '../../../modules/contractors';
import { User, UsersService } from '../../../modules/users';
import { Ocupation, OcupationsModule, OcupationsService } from '../../../modules/ocupations';
import { MaritalStatus, MaritalStatusesModule, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Rol, RolesModule, RolesService } from '../../../modules/roles';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identificationsTypes';
import { Gender, GendersService } from '../../../modules/genders';

describe('Contract Unit Tests', () => {
  let contractsController: ContractsController;
  let contractService: ContractsService;
  let contractModel: Model<Contract>;

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
          useValue: mockContractsService,
        },
        {
          provide: getModelToken(Contractor.name),
          useValue: mockContractsService,
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

    contractsController = module.get<ContractsController>(ContractsController);
    contractService = module.get<ContractsService>(ContractsService);
    contractModel = module.get<Model<Contract>>(getModelToken(Contract.name));

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
                          select: jest.fn().mockResolvedValue([mockContractsService.mockAllContracts]),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          } as any),
      );

      const resp = await contractsController.findAll({});

      expect(resp).toBeDefined();
      expect(resp?.success).toBeTruthy();
      expect(resp?.data).toBeDefined();
      expect(mockContractsService.mockContractsService.find).toHaveBeenCalledTimes(1);
    });

    // it('1.2 Controller.get should return a handled error', async () => {
    //   jest.spyOn(model, 'find').mockImplementation(
    //     () =>
    //       ({
    //         limit: () => ({
    //           skip: () => ({
    //             sort: jest.fn().mockResolvedValue(null),
    //           }),
    //         }),
    //       } as any),
    //   );

    //   let errorResult: any = {};

    //   try {
    //     await contractsController.findAll({});
    //   } catch (error) {
    //     errorResult = { ...error };
    //   }

    //   await expect(service.findAll).rejects.toThrow(BadRequestException);
    //   expect(errorResult).toBeDefined();
    // });
  });

  //   describe('2. Find Role by ID tests', () => {
  //     it('2.1 Controller.FindOne should return one existing rol', async () => {
  //       jest.spyOn(model, 'findById').mockResolvedValue(mockRol);

  //       const resp = await controller.findOne(mockRol.data.id);

  //       expect(resp).toBeDefined();
  //       expect(resp?.success).toBeTruthy();
  //       expect(resp?.data).toBeDefined();
  //       expect(model.findById).toHaveBeenCalledWith(mockRol.data.id);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(1);
  //       expect(resp?.data).toEqual(mockRol);

  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('2.2 Controller.FindOne should return a BadRequestException when the rol id is invalid', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

  //       const id = 'wrong_Id01';
  //       let respError: any = {};

  //       try {
  //         await controller.findOne(id);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_INVALID_VALUE);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(0);

  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('2.3 Controller.FindOne should return a NotFoundException when the rol id is not found', async () => {
  //       jest.spyOn(model, 'findById').mockResolvedValue(null);
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

  //       const id = mockRol.data.id;
  //       let respError: any = {};

  //       try {
  //         await controller.findOne(id);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(2);

  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.clearAllMocks();
  //     });
  //   });

  //   describe('3. Create Rol Tests', () => {
  //     it('3.1- Controller.create should return a new rol created', async () => {
  //       jest.spyOn(model, 'create').mockResolvedValue(mockRol as any);

  //       const resp = await controller.create(createdRol as any);

  //       expect(resp).toBeDefined();
  //       expect(resp?.success).toBeTruthy();
  //       expect(resp?.data).toBeDefined();
  //       expect(mockRolService.create).toHaveBeenCalledTimes(1);

  //       jest.spyOn(model, 'create').mockClear();
  //     });

  //     it('3.2- Controller.create should throw an unhandled error', async () => {
  //       jest.spyOn(model, 'create').mockRejectedValue(null);

  //       let respError: any = {};

  //       try {
  //         await controller.create({ name: 'ANY' } as any);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.create({ name: 'ANY' } as any)).rejects.toThrow();
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);
  //     });
  //   });

  //   describe('4- Patch Rol Tests', () => {
  //     it('4.1- Controller.update should return one updated rol', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(mockRol);
  //       jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(
  //         () =>
  //           ({
  //             select: jest.fn().mockResolvedValue(mockRol),
  //           } as any),
  //       );

  //       const resp = await controller.update(mockRol.data.id, {
  //         description: 'testing',
  //       });

  //       expect(resp).toBeDefined();
  //       expect(resp?.success).toBeTruthy();
  //       expect(resp?.data).toBeDefined();
  //       expect(model.findById).toHaveBeenCalledWith(mockRol.data.id);
  //       expect(mockRolService.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  //       expect(resp?.data).toEqual(mockRol);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('4.2- Controller.update should return a BadRequestException when the rol that comes in the request is empty', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(mockRol);

  //       let respError: any = {};
  //       const updateObj: UpdateRoleDto = {
  //         name: '',
  //       };

  //       try {
  //         await controller.update(mockRol.data.id, updateObj);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.update(mockRol.data.id, updateObj)).rejects.toThrow(BadRequestException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_INVALID_PAYLOAD);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(2);

  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('4.3- Controller.update should return a NotFoundException when the rol id was not found', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(null);

  //       const id = mockRol.data.id;
  //       let respError: any = {};

  //       try {
  //         await controller.update(id, { status: false });
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.update(id, { status: false })).rejects.toThrow(NotFoundException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(2);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('4.4- Controller.update should return a BadRequestException when the rol id is invalid', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
  //       jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(false);
  //       jest.spyOn(model, 'findById').mockResolvedValue(false);

  //       const id = 'wring-id';
  //       let respError: any = {};

  //       try {
  //         await controller.update(id, { status: false });
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.update(id, { status: false })).rejects.toThrow(BadRequestException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_INVALID_VALUE);
  //       expect(mockRolService.findById).toHaveBeenCalledTimes(0);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('4.5- Controller.update should return a general error', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(true);
  //       jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(
  //         () =>
  //           ({
  //             select: jest.fn().mockRejectedValue(null),
  //           } as any),
  //       );

  //       const id = mockRol.data.id;
  //       let respError: any = {};

  //       try {
  //         await controller.update(id, { status: false });
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.update(id, { status: false })).rejects.toThrow();
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.clearAllMocks();
  //     });
  //   });
  //   describe('5- Delete Rol Tests', () => {
  //     it('5.1- Controller.remove should return one removed rol', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockRol.data.id as any);
  //       jest.spyOn(model, 'findById').mockResolvedValue(mockRol);

  //       const resp = await controller.remove(mockRol.data.id);

  //       expect(resp).toBeDefined();
  //       expect(resp?.success).toBeTruthy();
  //       expect(resp?.data).toBeDefined();
  //       expect(mockRolService.findByIdAndDelete).toHaveBeenCalledTimes(1);
  //       expect(resp?.data).toEqual(mockRol.data.id);

  //       jest.spyOn(model, 'findByIdAndDelete').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('5.2- Controller.remove should return a NotFoundException when the rol id was not found', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(null).mockResolvedValue(null);

  //       const id = mockRol.data.id;
  //       let respError: any = {};

  //       try {
  //         await controller.remove(id);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_DATA_NOT_FOUND);
  //       expect(mockRolService.deleteOne).toHaveBeenCalledTimes(0);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(model, 'findById').mockClear();
  //       jest.spyOn(model, 'deleteOne').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('5.3- Controller.remove should return a BadRequestException when the rol id is invalid', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
  //       jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(false);
  //       jest.spyOn(model, 'findById').mockResolvedValue(false);

  //       const id = 'wrong-id2';
  //       let respError: any = {};

  //       try {
  //         await controller.remove(id);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.remove(id)).rejects.toThrow(BadRequestException);
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(ERR_MSG_INVALID_VALUE);
  //       expect(mockRolService.deleteOne).toHaveBeenCalledTimes(0);

  //       jest.spyOn(model, 'findByIdAndUpdate').mockClear();
  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.spyOn(model, 'deleteOne').mockClear();
  //       jest.clearAllMocks();
  //     });

  //     it('5.4- Controller.remove should return a general error', async () => {
  //       jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
  //       jest.spyOn(model, 'findById').mockResolvedValue(true);
  //       jest.spyOn(model, 'findByIdAndDelete').mockRejectedValue(null);

  //       const id = mockRol.data.id;
  //       let respError: any = {};

  //       try {
  //         await controller.remove(id);
  //       } catch (error) {
  //         respError = { ...error };
  //       }

  //       await expect(service.remove(id)).rejects.toThrow();
  //       expect(respError?.response).toBeDefined();
  //       expect(respError?.response.success).toBeFalsy();
  //       expect(respError?.response.message).toBe(`${ERR_MSG_GENERAL}`);

  //       jest.spyOn(model, 'findByIdAndDelete').mockClear();
  //       jest.spyOn(mongoose, 'isValidObjectId').mockClear();
  //       jest.spyOn(model, 'findByIdAndDelete').mockClear();
  //       jest.clearAllMocks();
  //     });
  //   });
});
