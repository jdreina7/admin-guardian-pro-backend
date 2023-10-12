import { CreateIdentificationTypesDto } from '../../modules/identificationsTypes/dto/create-identificationTypes.dto';

export const mockIdentificationTypeService = {
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

export const mockOneIdentificationType = {
  success: true,
  data: {
    type: 'tip',
    description: 'Testing with Jest',
    status: true,
    id: '64fcb8afda86b3322ddd5f15',
  },
};

export const mockAllIdentificationType = {
  success: true,
  data: [
    {
      type: 'tik',
      description: 'Testing with Jest 11',
      status: true,
      id: '64fcb8afda86b3322ddd5f19',
    },
    {
      type: 'tir',
      description: 'Testing with Jest 12',
      status: true,
      id: '64fcb8afda86b3322ddd5g15',
    },
  ],
};

export const mockIdentificationTypeDTO: Partial<CreateIdentificationTypesDto> = {
  type: 'tic',
  status: false,
};
