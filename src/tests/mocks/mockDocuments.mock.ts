import { CreateDocumentDto } from 'src/modules/documents/dto/create-document.dto';

export const mockDocumentsService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
  sort: jest.fn(),
  limit: jest.fn(),
  skip: jest.fn(),
  customValidateMongoId: jest.fn(),
  customCapitalizeFirstLetter: jest.fn(),
  UsersService: jest.fn(),
  DocumentTypesServices: jest.fn(),
};

export const mockOneDocument = {
  success: true,
  data: {
    documentName: 'testing333',
    documentTypeId: '64ff634163b34440083bab73',
    documentUrl: 'Http://secure.com',
    userOwnerId: '64fcb922317d8d062e2eb0d2',
    status: true,
    createdAt: '2023-10-31T02:07:50.233Z',
    updatedAt: '2023-10-31T02:07:50.233Z',
    id: '65406176155ecfe7ff515113',
  },
};

export const mockAllDocuments = {
  success: true,
  data: [
    {
      documentName: 'testing23',
      documentTypeId: {
        type: 'di',
        id: '64ff634163b34440083bab73',
      },
      documentUrl: 'Http://test.com',
      userOwnerId: {
        uid: 1114249857,
        id: '64fcb922317d8d062e2eb0d2',
      },
      status: true,
      description: 'Ahoraa',
      id: '650373679ed20ad13465b1fc',
      createdAt: '2023-09-09T18:27:46.461Z',
      updatedAt: '2023-10-03T00:02:24.672Z',
    },
    {
      documentName: 'testing23',
      documentTypeId: {
        type: 'di',
        id: '64ff634163b34440083bab73',
      },
      documentUrl: 'Http://test.com',
      userOwnerId: {
        uid: 1114249857,
        id: '64fcb922317d8d062e2eb0d2',
      },
      status: true,
      description: 'Ahoraa',
      id: '650373679ed20ad13465b1fc',
      createdAt: '2023-09-09T18:27:46.461Z',
      updatedAt: '2023-10-03T00:02:24.672Z',
    },
  ],
};

export const createdDocument: Partial<CreateDocumentDto> = {
  documentName: 'document',
  status: false,
};
