import { CreateContractorDto } from '../../modules/contractors/dto/create-contractor.dto';

export const mockContractorsService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

// Mock for a one Contract
export const mockOneContractor = {
  success: true,
  data: {
    userId: {
      uid: 123456,
      identificationTypeId: '64fab0be0d0a4b4111509ba0',
      email: 'oikokoko@gmail.com',
      firstName: 'Gabriel',
      middleName: 'David',
      lastName: 'Reina Acosta',
      genderId: '64fcb828b8224d148e5ea6e6',
      contactPhone: 2563972,
      address: 'Cra 37B',
      city: 'Palmira',
      birthday: '13/09/1990',
      userImg: '',
      username: 'gani el terrible',
      password: '12345',
      maritalStatusId: '64fcc2756e45b152a7cd25cd',
      ocupationId: '64fafe1cc85af4d2f85625bc',
      roleId: '64fa2777f3e9b81d46a2339b',
      status: false,
      lastLogin: '',
      createdAt: '2023-09-09T19:08:18.047Z',
      updatedAt: '2023-10-23T23:43:01.376Z',
      id: '64fcc2a26e45b152a7cd25dd',
    },
    status: true,
    createdAt: '2023-09-15T22:40:58.046Z',
    updatedAt: '2023-09-15T22:40:58.046Z',
    id: '6504dd7a38caeebe4f47966a',
  },
};

export const mockAllContractors = {
  success: true,
  data: [
    {
      userId: {
        uid: 123456,
        identificationTypeId: '64fab0be0d0a4b4111509ba0',
        email: 'oikokoko@gmail.com',
        firstName: 'Gabriel',
        middleName: 'David',
        lastName: 'Reina Acosta',
        genderId: '64fcb828b8224d148e5ea6e6',
        contactPhone: 2563972,
        address: 'Cra 37B',
        city: 'Palmira',
        birthday: '13/09/1990',
        userImg: '',
        username: 'gani el terrible',
        password: '12345',
        maritalStatusId: '64fcc2756e45b152a7cd25cd',
        ocupationId: '64fafe1cc85af4d2f85625bc',
        roleId: '64fa2777f3e9b81d46a2339b',
        status: false,
        lastLogin: '',
        createdAt: '2023-09-09T19:08:18.047Z',
        updatedAt: '2023-10-23T23:43:01.376Z',
        id: '64fcc2a26e45b152a7cd25dd',
      },
      status: true,
      createdAt: '2023-09-15T22:40:58.046Z',
      updatedAt: '2023-09-15T22:40:58.046Z',
      id: '6504dd7a38caeebe4f47966a',
    },
  ],
};

// Mock Create a new Contractor
export const createdContractor: Partial<CreateContractorDto> = {
  userId: '64fcc2a26e45b152a7cd25dd',
};
