import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';

export const mockRolService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
};

// Mock for all existing Roles
export const mockAllRoles = {
  success: true,
  data: [
    {
      name: 'admin',
      status: true,
      createdAt: '2023-09-07T21:15:49.440Z',
      updatedAt: '2023-09-07T21:24:05.330Z',
      description: 'We are changing some test',
      id: '64fa3d859e4d83d35d95d1ef',
    },
    {
      name: 'superadmin',
      description: 'Testing',
      status: true,
      createdAt: '2023-09-07T16:11:37.615Z',
      updatedAt: '2023-09-07T16:11:37.615Z',
      id: '64f9f639f10ace762d2896b6',
    },
    {
      name: 'user',
      status: true,
      createdAt: '2023-09-07T19:41:43.403Z',
      updatedAt: '2023-09-07T21:09:55.485Z',
      description: 'We are changing some test',
      id: '64fa2777f3e9b81d46a2339b',
    },
  ],
};

// Mock for a one Rol
export const mockRol = {
  success: true,
  data: {
    name: 'provider',
    description: '',
    status: true,
    createdAt: '2023-09-01T08:01:44.703Z',
    updatedAt: '2023-09-01T08:01:44.703Z',
    id: '64fcc2756e45b152a7cd25cd',
  },
};

// Mock for DTO
export const createdRol: Partial<CreateRoleDto> = {
  name: 'provider',
  status: false,
};
