export const mockGenderService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

export const mockOneGender = {
  success: true,
  data: {
    name: 'Female',
    description: 'Woman',
    status: true,
    createdAt: '2023-09-09T05:22:30.068Z',
    updatedAt: '2023-09-09T05:22:30.068Z',
    id: '64fc0116d24f9d87787889c1',
  },
};
