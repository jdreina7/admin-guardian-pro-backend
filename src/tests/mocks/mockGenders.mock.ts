import { CreateGenderDto } from 'src/modules/genders/dto/create-gender.dto';

export const mockGendersService = {
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

export const mockOneGender = {
  success: true,
  data: {
    name: 'Undefined',
    description: 'Man',
    status: true,
    id: '653d8d36ff75fb44e1a05889',
  },
};

export const mockAllGenders = {
  success: true,
  data: [
    {
      name: 'Female',
      description: 'Woman',
      status: true,
      id: '64fc0116d24f9d87787889c1',
    },
    {
      name: 'Male',
      description: 'Man',
      status: true,
      id: '64fcb828b8224d148e5ea6e6',
    },
    {
      name: 'Undefined',
      description: 'Testing update functionality',
      status: true,
      id: '653d8d36ff75fb44e1a05889',
    },
  ],
};

export const createdGender: Partial<CreateGenderDto> = {
  name: 'gender',
  description: 'Here you put the desc.',
};
