import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';

import { GendersController } from '../../../modules/genders/genders.controller';
import { GendersService } from '../../../modules/genders/genders.service';
import { Gender } from '../../../modules/genders/schemas/gender.schema';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import {
  createdGender,
  mockAllGenders,
  mockGendersService,
  mockOneGender,
} from '../../../tests/mocks/mockGenders.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from '../../../utils/contants';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Test genders controller', () => {
  let gendersController: GendersController;
  let gendersServices: GendersService;
  let gendersModel: Model<Gender>;

  let result: any = {};
  let errorResult: any = {};
  let { id } = mockOneGender.data;

  beforeEach(async () => {
    const gendersModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        GendersService,
        {
          provide: getModelToken(Gender.name),
          useValue: mockGendersService,
        },
      ],
      controllers: [GendersController],
    }).compile();

    gendersController = gendersModule.get<GendersController>(GendersController);
    gendersServices = gendersModule.get<GendersService>(GendersService);
    gendersModel = gendersModule.get<Model<Gender>>(getModelToken(Gender.name));

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

  describe('1.Test Creating a new Gender', () => {
    it('1.1 Controller.create must return the new created gender', async () => {
      jest.spyOn(mockGendersService, 'customCapitalizeFirstLetter').mockReturnValue(mockOneGender.data.name);
      jest.spyOn(gendersModel, 'create').mockResolvedValue(mockOneGender as any);

      result = await gendersController.create(createdGender as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneGender);
      expect(mockGendersService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(mockGendersService, 'customCapitalizeFirstLetter').mockClear();
      jest.spyOn(gendersModel, 'create').mockClear();
    });

    it('1.2 Controller.create must return a general error', async () => {
      jest.spyOn(gendersModel, 'create').mockRejectedValue(null);

      try {
        await gendersController.create({ name: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(gendersModel, 'create').mockClear();
    });
  });

  describe('2. Test get a existing gender by ID', () => {
    it('2.1 Controller.get must return a existing gender.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender as any);

      result = await gendersController.findOne(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneGender);
      expect(mockGendersService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
    });

    it('2.2 Controller.get must return badRequest for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = '23n3p30q';

      try {
        await gendersController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockGendersService.findById).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('2.3 Controller.get must return a notFound error by Id.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(null);

      try {
        await gendersController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockGendersService.findById).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
    });
  });

  describe('3. Test get all existing Genders.', () => {
    it('3.1 controller.get must return all existing genders.', async () => {
      jest.spyOn(gendersModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValue(mockAllGenders as any),
          } as any),
      );

      result = await gendersController.findAll();

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockAllGenders);
      expect(mockGendersService.find).toHaveBeenCalled();

      jest.spyOn(gendersModel, 'find').mockClear();
    });

    it('3.2 controller.get must return a general error.', async () => {
      jest.spyOn(gendersModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockRejectedValue(null),
          } as any),
      );

      try {
        await gendersController.findAll();
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockGendersService.find).toHaveBeenCalledTimes(1);

      jest.spyOn(gendersModel, 'find').mockClear();
    });
  });

  describe('4. Test update Gender by Id.', () => {
    let dataToUpdate = { name: 'Testing' };

    it('4.1 Controller.update must return', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender);
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneGender as any),
          } as any),
      );

      id = mockOneGender.data.id;
      result = await gendersController.update(id, dataToUpdate);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(mockGendersService.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockGendersService.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.2 Controller.update must return a badRequest for a invalid Id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = '334ninfw0';

      try {
        await gendersController.update(id, dataToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockGendersService.findByIdAndUpdate).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('4.3 Controller.update must return notFound error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(null);

      try {
        await gendersController.update(id, dataToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.update(id, dataToUpdate)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
    });

    it('4.4 Controller.update must return a badRequest for a invalid data', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender);
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(false),
          } as any),
      );

      dataToUpdate = { name: '' };

      try {
        await gendersController.update(id, dataToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.update(id, dataToUpdate)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_PAYLOAD}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockClear();
    });

    it('4.5 Controller.update must return a general error.', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender);
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      dataToUpdate = { name: 'ANY' };
      try {
        await gendersController.update(id, dataToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.update(id, dataToUpdate)).rejects.toThrow(ERR_MSG_GENERAL);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
      jest.spyOn(gendersModel, 'findByIdAndUpdate').mockClear();
    });
  });

  describe('5. Test delete Gender.', () => {
    it('5.1 controller.remove must return removed id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender);
      jest.spyOn(gendersModel, 'findByIdAndDelete').mockResolvedValue(id);

      id = mockOneGender.data.id;
      result = await gendersController.remove(id);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(id);
      expect(mockGendersService.findByIdAndDelete).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
      jest.spyOn(gendersModel, 'findByIdAndDelete').mockClear();
    });

    it('5.2 controller.remove must return a badRequest for a invalid Id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      id = '23knfvio4';

      try {
        await gendersController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockGendersService.findByIdAndDelete).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
    });

    it('5.3 controller.remove must return notFound error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(false);

      try {
        await gendersController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.remove(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(mockGendersService.findByIdAndDelete).not.toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
    });

    it('5.4 controller.remove must return a general Error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(gendersModel, 'findById').mockResolvedValue(mockOneGender);
      jest.spyOn(gendersModel, 'findByIdAndDelete').mockRejectedValue(null);

      try {
        await gendersController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(gendersServices.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
      expect(mockGendersService.findByIdAndDelete).toHaveBeenCalled();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(gendersModel, 'findById').mockClear();
      jest.spyOn(gendersModel, 'findByIdAndDelete').mockClear();
    });
  });
});
