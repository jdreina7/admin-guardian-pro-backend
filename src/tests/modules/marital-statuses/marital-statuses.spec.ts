import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { MaritalStatusesController } from '../../../modules/marital-statuses/marital-statuses.controller';
import { MaritalStatusesService } from '../../../modules/marital-statuses/marital-statuses.service';
import { MaritalStatus } from '../../../modules/marital-statuses/schemas/marital-status.schema';
import { LoginModule } from '../../../modules/login/login.module';
import {
  createdMaritalStatusDTO,
  mockALlMaritalStatus,
  mockMaritalStatusService,
  mockOneMaritalStatus,
} from '../../../tests/mocks/mockMaritalStatus.mock';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from '../../../utils/contants';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Marital-Status module tests', () => {
  let maritalService: MaritalStatusesService;
  let maritalController: MaritalStatusesController;
  let maritalModel: Model<MaritalStatus>;
  let { id } = mockOneMaritalStatus.data;
  let errorResult: any = {};
  let result: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginModule,
        MaritalStatusesService,
        {
          provide: getModelToken(MaritalStatus.name),
          useValue: mockMaritalStatusService,
        },
      ],
      controllers: [MaritalStatusesController],
    }).compile();

    maritalController = module.get<MaritalStatusesController>(MaritalStatusesController);
    maritalService = module.get<MaritalStatusesService>(MaritalStatusesService);
    maritalModel = module.get<Model<MaritalStatus>>(getModelToken(MaritalStatus.name));

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

  describe('1. Test create Marital-Status', () => {
    it('1.1 Controller.create must return a new marital-status created', async () => {
      jest.spyOn(maritalModel, 'create').mockResolvedValue(mockOneMaritalStatus as any);

      result = await maritalController.create(createdMaritalStatusDTO as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toEqual(mockOneMaritalStatus);
      expect(mockMaritalStatusService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(maritalModel, 'create').mockClear();
      jest.clearAllMocks();
    });

    it('1.2 Controller.create must return a handled error', async () => {
      jest.spyOn(maritalModel, 'create').mockRejectedValue(null);

      try {
        await maritalController.create({ name: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalService.create({ name: 'ANY' } as any)).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(maritalModel, 'create').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('2. Test Get one Marital-Status by ID', () => {
    it('2.1 Controller.FindOne must return a existing Marital-Status', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);

      result = await maritalController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneMaritalStatus);
      expect(mockMaritalStatusService.findById).toHaveBeenCalledTimes(1);
      expect(mockMaritalStatusService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.2 Controller.FindOne must return a BadRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'T32t_N30id';

      try {
        await maritalController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockMaritalStatusService.findById).toHaveBeenCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });

    it('2.3 Controller.FindOne must return a Handled error becouse the id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(null);

      id = mockOneMaritalStatus.data.id;
      try {
        await maritalController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockMaritalStatusService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });
  });

  describe('3. Test Get all Marital-Statuses', () => {
    it('3.1 Controller.FindAll must return all existing Marital-Statuses', async () => {
      jest.spyOn(maritalModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValue(mockALlMaritalStatus),
          } as any),
      );

      result = await maritalController.findAll();

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockALlMaritalStatus);
      expect(mockMaritalStatusService.find).toHaveBeenCalledTimes(1);

      jest.spyOn(maritalModel, 'find').mockClear();
      jest.clearAllMocks();
    });

    it('3.2 Controller.FindAll must return a general error', async () => {
      jest.spyOn(maritalModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await maritalController.findAll();
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockMaritalStatusService.find).toHaveBeenCalledTimes(1);

      jest.spyOn(maritalModel, 'find').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('4. Test update one Marital-Status by ID', () => {
    it('4.1 Controller.update must return updated Marital Status', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);
      jest.spyOn(maritalModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneMaritalStatus),
          } as any),
      );

      id = mockOneMaritalStatus.data.id;
      result = await maritalController.update(id, { description: 'Testing with jest' });

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneMaritalStatus);
      expect(mockMaritalStatusService.findByIdAndUpdate).toHaveBeenCalledTimes(1);

      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.2 Controller.update must return a badrequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = '58fsd84fr';
      try {
        await maritalController.update(id, { description: 'Testing' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.update(id, { description: 'Testing' })).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });

    it('4.3 Controller.update must return a handled error because id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(false);

      try {
        await maritalController.update(id, { description: 'testing' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.update(id, { description: 'testing' })).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('4.4 Controller.update must return a handled error becouse empty data was sent', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);
      jest.spyOn(maritalModel, 'findByIdAndUpdate').mockResolvedValue(false);

      try {
        await maritalController.update(id, { name: '' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.update(id, { name: '' })).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_PAYLOAD}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(maritalModel, 'findByIdAndUpdate').mockClear();
      jest.clearAllMocks();
    });

    it('4.5 Controller.update must return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);
      jest.spyOn(maritalModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await maritalController.update(id, { description: 'test' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.update(id, { description: 'test' })).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(maritalModel, 'findByIdAndUpdate').mockClear();
      jest.clearAllMocks();
    });
  });

  describe('5. Test Delete a Marital-Status by id', () => {
    it('5.1 Controller.Remove must return the removed ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);
      jest.spyOn(maritalModel, 'findByIdAndDelete').mockResolvedValue(id);

      result = await maritalController.remove(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(id);
      expect(mockMaritalStatusService.findByIdAndDelete).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(maritalModel, 'findByIdAndDelete').mockClear();
      jest.clearAllMocks();
    });

    it('5.2 Controller.Remove must return badrequet for invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = '{ie4343ds';

      try {
        await maritalController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.clearAllMocks();
    });

    it('5.3 Controller.Remove must return notFoundException.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(false);

      try {
        await maritalController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.remove(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
    });

    it('5.4 Controller.Remove must return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(maritalModel, 'findById').mockResolvedValue(mockOneMaritalStatus);
      jest.spyOn(maritalModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await maritalController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(maritalController.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(maritalModel, 'findById').mockClear();
      jest.spyOn(maritalModel, 'findByIdAndDelete').mockClear();
      jest.clearAllMocks();
    });
  });
});
