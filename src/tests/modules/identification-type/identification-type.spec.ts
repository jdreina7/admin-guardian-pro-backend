import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';

import { IdentificationsTypesController } from '../../../modules/identifications-types/identification-types.controller';
import { IdentificationsTypesService } from '../../../modules/identifications-types/identification-types.service';
import { IdentificationTypes } from '../../../modules/identifications-types/schemas/identification-types.schema';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  mockAllIdentificationType,
  mockIdentificationTypeDTO,
  mockIdentificationTypeService,
  mockOneIdentificationType,
} from '../../../tests/mocks/mockidentificationType.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from '../../../utils/contants';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Test Indentification Type module', () => {
  let idTypeController: IdentificationsTypesController;
  let idTypeService: IdentificationsTypesService;
  let idTypeModel: Model<IdentificationTypes>;
  let { id } = mockOneIdentificationType.data;
  let resultError: any = {};
  let result: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        IdentificationsTypesService,
        {
          provide: getModelToken(IdentificationTypes.name),
          useValue: mockIdentificationTypeService,
        },
      ],
      controllers: [IdentificationsTypesController],
    }).compile();

    idTypeController = module.get<IdentificationsTypesController>(IdentificationsTypesController);
    idTypeService = module.get<IdentificationsTypesService>(IdentificationsTypesService);
    idTypeModel = module.get<Model<IdentificationTypes>>(getModelToken(IdentificationTypes.name));

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

  //Create
  describe('1. Test create Identification-Type', () => {
    it('1.1 Controller.create must return a new id Type created', async () => {
      jest.spyOn(idTypeModel, 'create').mockResolvedValue(mockOneIdentificationType as any);

      result = await idTypeController.create(mockIdentificationTypeDTO as any);

      expect(result?.data.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneIdentificationType);
      expect(mockIdentificationTypeService.create).toHaveBeenCalledTimes(1);
      expect(mockIdentificationTypeService.create).toHaveBeenCalledWith(mockIdentificationTypeDTO);

      jest.spyOn(idTypeModel, 'create').mockClear();
      jest.clearAllMocks();
    });

    it('1.2 Controller.create must return a general error', async () => {
      jest.spyOn(idTypeModel, 'create').mockRejectedValue(null);

      try {
        await idTypeController.create({ type: 'ANY' } as any);
      } catch (error) {
        resultError = { ...error };
      }
      await expect(idTypeService.create({ type: 'ANY' } as any)).rejects.toThrow();
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response).toBeDefined();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      jest.spyOn(idTypeModel, 'create').mockClear();
    });
  });

  describe('2. Test Get Identification-Type by id', () => {
    it('2.1 Controller.Get must return a Identification-Type with the searched ID.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);

      result = await idTypeController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneIdentificationType);
      expect(mockIdentificationTypeService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
    });

    it('2.2 Controller.Get must return a badrequest becouse the ID is not valid', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'ote329nr3i';
      try {
        await idTypeController.findOne(id);
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.findOne(id)).rejects.toThrow(BadRequestException);
      expect(resultError?.success).toBeFalsy();
      expect(resultError?.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockIdentificationTypeService.findById).toHaveBeenCalledTimes(0);
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('2.3 Controller.Get must return a handled error when the ID was not found.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(null);

      id = mockOneIdentificationType.data.id;
      try {
        await idTypeController.findOne(id);
      } catch (error) {
        resultError = { ...error };
      }

      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response).toBeDefined();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockIdentificationTypeService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
    });
  });

  describe('3. Test Get All Identification-Types', () => {
    it('3.1 Controller.findAll must return all existing Identification-types.', async () => {
      jest.spyOn(idTypeModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValue(mockAllIdentificationType as any),
          } as any),
      );

      result = await idTypeController.findAll();

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockAllIdentificationType);
      expect(mockIdentificationTypeService.find).toHaveBeenCalledTimes(1);

      jest.spyOn(idTypeModel, 'find').mockClear();
    });

    it('3.2 Controller.findAll must return a general error', async () => {
      jest.spyOn(idTypeModel, 'find').mockImplementation(
        // find is called the first time
        () =>
          ({
            sort: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await idTypeController.findAll(); // find is called second time
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.findAll()).rejects.toThrow(BadRequestException);
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response).toBeDefined;
      expect(mockIdentificationTypeService.find).toHaveBeenCalledTimes(2);

      jest.spyOn(idTypeModel, 'find').mockClear();
    });
  });

  describe('4. Test Update Identification-Type by ID.', () => {
    it('4.1 Controller.update must return the Identification-Type with the new data.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneIdentificationType),
          } as any),
      );
      const data: any = { description: 'Testing' };
      id = mockOneIdentificationType.data.id;
      result = await idTypeController.update(id, data);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneIdentificationType);
      expect(mockIdentificationTypeService.findByIdAndUpdate).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.2 Controller.update must return a badrequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'molncr3e34';

      try {
        await idTypeController.update(id, { description: 'testing with jest' });
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.update(id, { description: 'testing with jest' })).rejects.toThrow(
        BadRequestException,
      );
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockIdentificationTypeService.findByIdAndUpdate).toHaveBeenCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.3 Controller.update must return a notfoundexception error.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(false);

      try {
        await idTypeController.update(id, { description: 'testing with jest' });
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.update(id, { description: 'testing with jest' })).rejects.toThrow(
        NotFoundException,
      );
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response).toBeDefined();
      expect(mockIdentificationTypeService.findByIdAndUpdate).toHaveBeenCalledTimes(0);

      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.4 Controller.update must return a badrequest for a sent invalid data.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(false),
          } as any),
      );

      const data: any = { type: '' };

      try {
        await idTypeController.update(id, data);
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.update(id, data)).rejects.toThrow(BadRequestException);
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response).toBeDefined();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_INVALID_PAYLOAD}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.5 Controller.update must return a general error.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await idTypeController.update(id, { description: 'testing with jest' });
      } catch (error) {
        resultError = { ...error };
      }

      expect(resultError?.response).toBeDefined();
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockIdentificationTypeService.findByIdAndUpdate).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(idTypeModel, 'findByIdAndUpdate').mockClear();
    });
  });

  describe('5. Test Delete Identification-Type by ID.', () => {
    it('5.1 Controller.remove must return deleted ID.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);
      jest.spyOn(idTypeModel, 'findByIdAndDelete').mockResolvedValue(id);

      id = mockOneIdentificationType.data.id;
      result = await idTypeController.remove(id);

      console.log(result);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(id);
      expect(mockIdentificationTypeService.findByIdAndDelete).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(idTypeModel, 'findByIdAndDelete').mockClear();
    });

    it('5.2 Controller.remove must return badrequest for a invalid ID.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = 'air23ndw';

      try {
        await idTypeController.remove(id);
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.remove(id)).rejects.toThrow(BadRequestException);
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(resultError?.response).toBeDefined();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('5.3 Controller.remove must return notfound error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(false);

      try {
        await idTypeController.remove(id);
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.remove(id)).rejects.toThrow(NotFoundException);
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(resultError?.response).toBeDefined();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
    });

    it('5.4 Controller.remove must return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(idTypeModel, 'findById').mockResolvedValue(mockOneIdentificationType);
      jest.spyOn(idTypeModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await idTypeController.remove(id);
      } catch (error) {
        resultError = { ...error };
      }

      await expect(idTypeController.remove(id)).rejects.toThrow(BadRequestException);
      expect(resultError?.response.success).toBeFalsy();
      expect(resultError?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockIdentificationTypeService.findByIdAndDelete).toHaveBeenCalledTimes(2);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(idTypeModel, 'findById').mockClear();
      jest.spyOn(idTypeModel, 'findByIdAndDelete').mockClear();
    });
  });
});
