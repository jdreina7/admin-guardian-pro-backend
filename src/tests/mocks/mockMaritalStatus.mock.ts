import { CreateMaritalStatusDto } from '../../modules/marital-statuses/dto/create-marital-status.dto';

export const mockMaritalStatusService = {
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

export const mockOneMaritalStatus = {
  success: true,
  data: {
    name: 'Divorced',
    status: true,
    createdAt: '2023-10-07T18:11:09.275Z',
    updatedAt: '2023-10-07T18:11:09.275Z',
    id: '65219f3d30bac6150f0a9fee',
  },
};

export const mockALlMaritalStatus = {
  success: true,
  data: [
    {
      name: 'Divorced',
      status: true,
      createdAt: '2023-10-07T18:11:09.275Z',
      updatedAt: '2023-10-07T18:11:09.275Z',
      id: '65219f3d30bac6150f0a9fee',
    },
    {
      name: 'Married',
      status: true,
      createdAt: '2023-09-09T19:07:37.698Z',
      updatedAt: '2023-09-09T19:07:37.698Z',
      id: '64fcc2796e45b152a7cd25cf',
    },
    {
      name: 'Single',
      status: true,
      createdAt: '2023-09-09T19:07:33.732Z',
      updatedAt: '2023-09-09T19:07:33.732Z',
      id: '64fcc2756e45b152a7cd25cd',
    },
    {
      name: 'Widower',
      status: true,
      createdAt: '2023-09-08T12:55:22.619Z',
      updatedAt: '2023-09-08T12:55:22.619Z',
      id: '64fb19baf0326bb9e6823380',
    },
  ],
};

export const createdMaritalStatusDTO: Partial<CreateMaritalStatusDto> = {
  name: 'provider',
  status: false,
};
