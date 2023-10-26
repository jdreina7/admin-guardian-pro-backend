export const mockOcupationService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

export const mockOneOcupation = {
  success: true,
  data: {
    name: 'None',
    description: 'none ocupation',
    status: true,
    createdAt: '2023-09-08T10:54:44.196Z',
    updatedAt: '2023-09-08T10:54:44.196Z',
    id: '64fafd741ddd9ca0422df6f1',
  },
};
