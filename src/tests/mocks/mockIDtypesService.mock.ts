export const mockIDTypesService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

export const mockOneIDTypes = {
  success: true,
  data: {
    type: 'cc',
    description: 'testing',
    status: true,
    createdAt: '2023-09-09T18:25:28.799Z',
    updatedAt: '2023-09-09T18:25:28.799Z',
    id: '64fcb898da86b3322ddd5f13',
  },
};
