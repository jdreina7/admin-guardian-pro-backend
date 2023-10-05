import { CreateDocumentTypeDto } from 'src/modules/document-types/dto/create-document-type.dto';

export const mockDocumentTypeService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
  customValidateMongoId: jest.fn(),
};

// Mock for all existing Roles
export const mockAllDocTypes = {
  success: true,
  data: [
    {
      name: 'pp',
      description: 'We are changing some test',
      status: true,
      id: '64fa3d859e4d83d35d95d1ef',
    },
    {
      name: 'pdo',
      description: 'This is testing jest',
      status: true,
      id: '64fa3d859e4d837cd25d1ef',
    },
    {
      name: 'xz',
      description: 'This is testing jest',
      status: true,
      id: '64fa3d859e4d83d35d95h1iH',
    },
  ],
};

// Mock for a one Doc-type
export const mockOneDocType = {
  success: true,
  data: {
    type: 'cg',
    description: '',
    status: true,
    createdAt: '2023-10-01T08:01:44.703Z',
    updatedAt: '2023-10-01T08:01:44.703Z',
    id: '64fcc2756e45b152a7cd25cd',
  },
};

// Mock for DTO
export const createdDocType: Partial<CreateDocumentTypeDto> = {
  type: 'provider',
  status: false,
};
