import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';

import { DocumentTypesService } from '../../../modules/document-types/document-types.service';
import { DocumentTypesController } from '../../../modules/document-types/document-types.controller';
import { DocumentType } from '../../../modules/document-types/schemas/document-type.schema';
import {
  createdDocType,
  mockAllDocTypes,
  mockDocumentTypeService,
  mockOneDocType,
} from '../../mocks/mockDocumentTypeService.mock';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from '../../../utils/contants';
import { UpdateDocumentTypeDto } from '../../../modules/document-types/dto/update-document-type.dto';
import { MockAuthModule } from '../../mocks/mockAuthModule.mock';

describe('Document-types controller', () => {
  let docTypeController: DocumentTypesController;
  let docTypeService: DocumentTypesService;
  let docTypeModel: Model<DocumentType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypesService,
        {
          provide: getModelToken(DocumentType.name),
          useValue: mockDocumentTypeService,
        },
      ],
      controllers: [DocumentTypesController],
    }).compile();

    docTypeController = module.get<DocumentTypesController>(DocumentTypesController);
    docTypeService = module.get<DocumentTypesService>(DocumentTypesService);
    docTypeModel = module.get<Model<DocumentType>>(getModelToken(DocumentType.name));

    jest.mock('./../../../common/decorators/auth.decorator.ts', () => {
      return {
        AuthModule: {
          forRootAsync: jest.fn().mockImplementation(() => MockAuthModule),
        },
      };
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1.Test create a document-type', () => {
    it('1.1 Controller.create should return a new document type created ', async () => {
      jest.spyOn(docTypeModel, 'create').mockResolvedValue(mockOneDocType as any);

      const result = await docTypeController.create(createdDocType as any);

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toBe(mockOneDocType);
      expect(mockDocumentTypeService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(docTypeModel, 'create').mockClear();
      jest.clearAllMocks();
    });

    it('1.2 Controller.create should return a handled error when fails creating a document type', async () => {
      jest.spyOn(docTypeModel, 'create').mockRejectedValue(null);

      let errorResult: any = {};

      try {
        await docTypeController.create({ type: 'ANY' } as any);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.create({ type: 'ANY' } as any)).rejects.toThrow();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toBe(`${ERR_MSG_GENERAL}`);
    });
  });

  describe('2. Test get a document-type', () => {
    it('2.1 Controller.get should return one document type by id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(mockOneDocType as any);

      const result = await docTypeController.findOne(mockOneDocType.data.id);

      expect(result?.data).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toEqual(mockOneDocType);
      expect(docTypeModel.findById).toBeCalledWith(mockOneDocType.data.id);
      expect(mockDocumentTypeService.findById).toBeCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear();
      jest.spyOn(docTypeModel, 'findById').mockClear();
      jest.clearAllMocks();
    });

    it('2.2 Controller.get should return a badrequest when the ID is not valid ', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      const id = 'eo23nm45n';
      let errorResult: any = {};

      try {
        await docTypeController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.findOne(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockDocumentTypeService.findById).toBeCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.clearAllMocks();
    });

    it('2.3 Controller.get should return a badrequest when the ID is not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(null);

      const id = mockOneDocType.data.id;
      let errorResult: any = {};

      try {
        await docTypeController.findOne(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.clearAllMocks();
    });
  });

  describe('3. Test get all existing documents-types', () => {
    it('3.1 Controller.get should return all existing documents-types', async () => {
      jest.spyOn(docTypeModel, 'find').mockImplementation(
        () =>
          ({
            sort: () => ({
              select: jest.fn().mockResolvedValue([mockAllDocTypes]),
            }),
          } as any),
      );

      const result = await docTypeController.findAll();

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(mockDocumentTypeService.find).toBeCalledTimes(1);

      jest.spyOn(docTypeModel, 'find').mockClear;
      jest.clearAllMocks();
    });

    it('3.2 Controller.FindAll must return a general error', async () => {
      jest.spyOn(docTypeModel, 'find').mockImplementation(
        () =>
          ({
            sort: () => ({
              select: jest.fn().mockRejectedValue(null),
            }),
          } as any),
      );

      let errorResult: any = {};

      try {
        await docTypeController.findAll();
      } catch (error) {
        errorResult = { ...error };
      }

      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);
    });
  });

  describe('4. Testing update document-type functionality', () => {
    it('4.1 Controller.update should return a updated document-type', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(mockOneDocType);
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockResolvedValue(mockOneDocType),
          } as any),
      );
      const { id } = mockOneDocType.data;
      const result = await docTypeController.update(id, {
        description: 'Testing with jest',
      });

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(mockDocumentTypeService.findById).toBeCalledTimes(1);
      expect(docTypeModel.findById).toHaveBeenCalledWith(id);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockClear;
      jest.clearAllMocks();
    });

    it('4.2  Controller.update should return a error for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(false);
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockResolvedValue(false);

      const id = '58fsd84fr';
      let errorResult: any = {};

      try {
        await docTypeController.update(id, { description: 'Testing' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.update(id, { description: 'Testing' })).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockDocumentTypeService.findById).toBeCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockClear;
      jest.clearAllMocks();
    });

    it('4.3 Controller.update should return a handled error for a not found ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockResolvedValue(false);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(false);

      const { id } = mockOneDocType.data;
      let errorResult: any = {};

      try {
        await docTypeController.update(id, { description: 'testing' });
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.update(id, { description: 'testing' })).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(errorResult?.response).toBeDefined();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.clearAllMocks();
    });

    it('4.4 Controller.update should return a badrequest for send a empty data to update', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(mockOneDocType);

      let errorResult: any = {};
      const { id } = mockOneDocType.data;
      const objToUpdate: UpdateDocumentTypeDto = {
        type: '',
      };

      try {
        await docTypeController.update(id, objToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.update(id, objToUpdate)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_PAYLOAD}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.clearAllMocks();
    });

    it('4.5 Controller.update should return a error general', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(true);
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            select: jest.fn().mockRejectedValue(null),
          } as any),
      );

      const { id } = mockOneDocType.data;
      let errorResult: any = {};
      const objToUpdate: UpdateDocumentTypeDto = {
        description: 'test',
      };

      try {
        await docTypeController.update(id, objToUpdate);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.update(id, objToUpdate)).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndUpdate').mockClear;
      jest.clearAllMocks();
    });
  });

  describe('5. Testing remove document-type functionality', () => {
    it('5.1 Controller.remove should return a id deleted element', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(mockOneDocType);
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockResolvedValueOnce(mockOneDocType.data.id);

      const result = await docTypeController.remove(mockOneDocType.data.id);

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.data).toBe(mockOneDocType.data.id);
      expect(mockDocumentTypeService.findByIdAndDelete).toHaveBeenCalledTimes(1);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockClear;
      jest.clearAllMocks();
    });

    it('5.2 Controller.remove should return a error for a invalid ID', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(false);
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockResolvedValue(false);

      const id = '58fsd84fr';
      let errorResult: any = {};

      try {
        await docTypeController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.remove(id)).rejects.toThrow(BadRequestException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_INVALID_ID}`);
      expect(mockDocumentTypeService.findById).toBeCalledTimes(0);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockClear;
      jest.clearAllMocks();
    });

    it('5.3 Controller.remove should return a notfoundException', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockResolvedValue(false);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(false);

      const { id } = mockOneDocType.data;
      let errorResult: any = {};

      try {
        await docTypeController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.remove(id)).rejects.toThrow(NotFoundException);
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_DATA_NOT_FOUND}`);
      expect(errorResult?.response).toBeDefined();

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.clearAllMocks();
    });

    it('5.4 Controller.remove should return a general error', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      jest.spyOn(docTypeModel, 'findById').mockResolvedValue(true);
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockRejectedValue(null);

      const { id } = mockOneDocType.data;
      let errorResult: any = {};

      try {
        await docTypeController.remove(id);
      } catch (error) {
        errorResult = { ...error };
      }

      await expect(docTypeService.remove(id)).rejects.toThrow();
      expect(errorResult?.response.success).toBeFalsy();
      expect(errorResult?.response).toBeDefined();
      expect(errorResult?.response.message).toEqual(`${ERR_MSG_GENERAL}`);

      jest.spyOn(mongoose, 'isValidObjectId').mockClear;
      jest.spyOn(docTypeModel, 'findById').mockClear;
      jest.spyOn(docTypeModel, 'findByIdAndDelete').mockClear;
      jest.clearAllMocks();
    });
  });
});
