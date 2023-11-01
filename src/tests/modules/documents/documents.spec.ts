import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import { Documents } from './../../../modules/documents/schemas/document.schema';
import { DocumentsController, DocumentsService } from '../../../modules/documents';
import { createdDocument, mockOneDocument, mockDocumentsService } from '../../../tests/mocks/mockDocuments.mock';
import { DocumentType, DocumentTypesService } from '../../../modules/document-types';
import { LoginService, User, UsersService } from '../../../modules/users';
import { mockDocumentTypeService, mockUserService } from '../../../tests/mocks';
import { mockOneDocType } from '../../../tests/mocks/mockDocumentTypeService.mock';
import { mockOneUser } from '../../../tests/mocks/mockUsersService.mock';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';

describe('Document module Test', () => {
  let docController: DocumentsController;
  let docServices: DocumentsService;
  let docModel: Model<Documents>;
  let docTypeService: DocumentTypesService;
  let usrModel: Model<User>;
  let userServices: typeof mockUserService;
  const { id } = mockOneDocument.data;
  let result: any = {};
  const errorResult: any = {};

  beforeEach(async () => {
    const docModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginService,
        JwtService,
        DocumentsService,
        DocumentTypesService,
        UsersService,
        {
          provide: getModelToken(Documents.name),
          useValue: mockDocumentsService,
        },
        {
          provide: getModelToken(DocumentType.name),
          useValue: mockDocumentTypeService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
      controllers: [DocumentsController],
    }).compile();

    docController = docModule.get<DocumentsController>(DocumentsController);
    docServices = docModule.get<DocumentsService>(DocumentsService);
    docModel = docModule.get<Model<Documents>>(getModelToken(Documents.name));
    usrModel = docModule.get<Model<User>>(getModelToken(User.name));
    userServices = docModule.get<typeof userServices>(mockDocumentsService.UsersService);
    docTypeService = docModule.get<DocumentTypesService>(DocumentTypesService);

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

    jest.spyOn(docTypeService, 'findOne').mockResolvedValue(mockOneDocType as any);
    jest.spyOn(usrModel, 'findOne').mockResolvedValue(mockOneUser as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Create Document', () => {
    it('1.1 Controller.create must Return a new created Document', async () => {
      jest.spyOn(docModel, 'create').mockResolvedValue(mockOneDocument as any);

      result = await docController.create(createdDocument as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneDocument);
      expect(mockDocumentsService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(docModel, 'create').mockClear();
    });
    //it('1. Controller.create must Return', async () => {});
  });
  //describe('# Document', () => {});
  //describe('# Document', () => {});
  //describe('# Document', () => {});
  //describe('# Document', () => {});
});
