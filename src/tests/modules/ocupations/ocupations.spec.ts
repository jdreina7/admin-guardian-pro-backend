import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { OcupationsController } from '../../../modules/ocupations/ocupations.controller';
import { OcupationsService } from '../../../modules/ocupations/ocupations.service';
import { Ocupation } from '../../../modules/ocupations/schemas/ocupation.schema';
import {
  createdOcupation,
  mockAllOcupations,
  mockOcupationService,
  mockOneOcupation,
} from '../../../tests/mocks/mockOcupationsService.mock';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from '../../../utils/contants';

describe('Marital-Status module tests', () => {
  let ocupController: OcupationsController;
  let ocupService: OcupationsService;
  let ocupModel: Model<Ocupation>;
  let { id } = mockOneOcupation.data;
  let errorResult: any = {};
  let result: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        OcupationsService,
        {
          provide: getModelToken(Ocupation.name),
          useValue: mockOcupationService,
        },
      ],
      controllers: [OcupationsController],
    }).compile();

    ocupController = module.get<OcupationsController>(OcupationsController);
    ocupService = module.get<OcupationsService>(OcupationsService);
    ocupModel = module.get<Model<Ocupation>>(getModelToken(Ocupation.name));

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

  describe('1. Test create Ocupation', () => {
    it('1.1 Controller.create must return a new created Ocupation', async () => {
      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockResolvedValue(mockOneOcupation.data.name);
      jest.spyOn(ocupModel, 'create').mockResolvedValue(mockOneOcupation as any);

      result = await ocupController.create(createdOcupation as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneOcupation);
      expect(mockOcupationService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockClear();
      jest.spyOn(ocupModel, 'create').mockClear();
    });

    it('1.2 Controller.create must return a general error', async () => {
      jest.spyOn(ocupModel, 'create').mockRejectedValue(null);

      try {
        await ocupController.create({ name: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.create({ name: 'ANY' } as any)).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(ocupModel, 'create').mockClear();
    });
  });

  describe('2. Test find one Ocupation', () => {
    it('2.1 Controller.findOne must return  existing ocupation', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);

      result = await ocupController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneOcupation);
      expect(mockOcupationService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
    });

    it('2.2 Controller.findOne must return a BadRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'firen322';
      try {
        await ocupController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.findOne(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('2.3 Controller.findOne must return a NotFound error becouse the id was not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(null);

      try {
        await ocupController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy;
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
    });
  });

  describe('3. Test find all Ocupations', () => {
    it('3.1 Controller.findAll must return all existing ocupations', async () => {
      jest.spyOn(ocupModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValue(mockAllOcupations),
          } as any),
      );

      result = await ocupController.findAll();

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockAllOcupations);
      expect(mockOcupationService.find).toHaveBeenCalledTimes(1);

      jest.spyOn(ocupModel, 'find').mockClear();
    });

    it('3.2 Controller.findAll must return a general error', async () => {
      jest.spyOn(ocupModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await ocupController.findAll();
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupController.findAll()).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      jest.spyOn(ocupModel, 'find').mockClear();
    });
  });

  describe('4. Test update one Ocupation', () => {
    it('4.1 Controlle.update must return the updated ocupation', async () => {
      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockResolvedValue(mockOneOcupation.data.name);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneOcupation),
          } as any),
      );

      id = mockOneOcupation.data.id;
      const data = { name: 'newOcupation' };
      result = await ocupController.update(id, data);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneOcupation);
      expect(mockOcupationService.findByIdAndUpdate).toHaveBeenCalledTimes(1);

      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.2 Controlle.update must return a BadReques for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'dls3 nfew';
      try {
        await ocupController.update(id, { status: false });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.update(id, { status: false })).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.3 Controller.update must return a notFound Error for id not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(false);

      try {
        await ocupController.update(id, { status: false });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.update(id, { status: false })).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
    });

    it('4.4 Controller.update must return BadRequest for a invalid Data', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(false),
          } as any),
      );

      try {
        await ocupController.update(id, { name: '' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.update(id, { name: '' })).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_PAYLOAD}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.5 Controller.update must return a general error', async () => {
      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockResolvedValue(mockOneOcupation.data.name);
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await ocupController.update(id, { name: 'testing' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.update(id, { name: 'testing' })).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mockOcupationService, 'customCapitalizeFirstLetter').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
      jest.spyOn(ocupModel, 'findByIdAndUpdate').mockClear();
    });
  });

  describe('5. Test delete one Ocupation', () => {
    it('5.1 Controller.remove must return the id deleted', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);
      jest.spyOn(ocupModel, 'findByIdAndDelete').mockResolvedValue(id);

      id = mockOneOcupation.data.id;
      result = await ocupController.remove(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(id);
      expect(mockOcupationService.findByIdAndDelete).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
      jest.spyOn(ocupModel, 'findByIdAndDelete').mockClear();
    });

    it('5.2 Controller.remove must return a badRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'akur223';

      try {
        await ocupController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('5.3 Controller.remove must return a NotFound error for not found ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(false);

      try {
        await ocupController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.remove(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockOcupationService.findByIdAndDelete).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
    });

    it('5.4 Controller.remove must return a general Error.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(ocupModel, 'findById').mockResolvedValue(mockOneOcupation);
      jest.spyOn(ocupModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await ocupController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(ocupService.remove(id)).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(ocupModel, 'findById').mockClear();
      jest.spyOn(ocupModel, 'findByIdAndDelete').mockClear();
    });
  });
});
