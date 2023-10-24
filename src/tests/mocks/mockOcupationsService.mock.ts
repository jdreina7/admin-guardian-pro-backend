import { CreateOcupationDto } from 'src/modules/ocupations/dto/create-ocupation.dto';

// Mock for every existing functions in the service document.
export const mockOcupationService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
  customValidateMongoId: jest.fn(),
  customCapitalizeFirstLetter: jest.fn(),
};

// Mock for one ocupation
export const mockOneOcupation = {
  success: true,
  data: {
    name: 'ocupation',
    status: true,
    createdAt: '2023-10-19T21:27:47.377Z',
    updatedAt: '2023-10-19T21:27:47.377Z',
    id: '65319f5434318665dc3b35fb',
  },
};

// Mock all ocupations
export const mockAllOcupations = {
  success: true,
  data: [
    {
      name: 'ocupation1',
      description: 'none ocupation',
      status: true,
      createdAt: '2023-09-08T10:54:44.196Z',
      updatedAt: '2023-09-08T10:54:44.196Z',
      id: '64fafd743431d9ca0422df6f1',
    },
    {
      name: 'ocupation2',
      status: true,
      createdAt: '2023-09-08T10:57:40.261Z',
      updatedAt: '2023-09-08T10:57:40.261Z',
      id: '64fafe24c434314d2f85625be',
    },
    {
      name: 'ocupation3',
      status: true,
      createdAt: '2023-09-08T10:57:32.480Z',
      updatedAt: '2023-09-08T10:57:32.480Z',
      id: '64fafe1cc8434312f85625bc',
    },
  ],
};

// Mock for DTO
export const createdOcupation: Partial<CreateOcupationDto> = {
  name: 'ocupation',
  status: false,
};
