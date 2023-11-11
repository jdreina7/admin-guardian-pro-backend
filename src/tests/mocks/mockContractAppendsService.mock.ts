import { CreateContractAppendDto } from '../../modules/contract-appends/dto/create-contract-append.dto';

export const mockContractAppendsService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

export const mockAllContractAppends = {
  success: true,
  data: [
    {
      title: 'Append #1',
      content: 'This is the content example',
      createdByUserId: {
        uid: 0,
        identificationTypeId: '64fcb898da86b3322ddd5f13',
        email: 'judareiro@gmail.com',
        firstName: 'Juan',
        middleName: 'David',
        lastName: 'Reina',
        address: 'Cra 37B',
        city: 'Palmira',
        birthday: '13/09/1990',
        userImg: '',
        username: 'judareiro',
        password: '$2b$10$xt3FQTzAKyvSBBbBOAFlk.szCCgABN7Hl8ItQdPSDLM/xJeRiccyO',
        maritalStatusId: '64fb19baf0326bb9e6823380',
        ocupationId: '64fcb828b8224d148e5ea6ff',
        roleId: '64f9f639f10ace762d2896b6',
        status: true,
        lastLogin: '',
        createdAt: '2023-09-08T14:32:47.040Z',
        updatedAt: '2023-09-17T04:44:47.246Z',
        genderId: '64fcb828b8224d148e5ea6e6',
        id: '64fb308f4751d652d08903d0',
      },
      status: true,
      createdAt: '2023-09-15T05:44:17.840Z',
      updatedAt: '2023-09-15T05:44:17.840Z',
      id: '6503ef3131e64335e124fd55',
    },
  ],
};

// Mock for a one Contract Appends
export const mockOneContractAppend = {
  success: true,
  data: [
    {
      title: 'Append #1',
      content: 'This is the content example',
      createdByUserId: {
        uid: 0,
        identificationTypeId: '64fcb898da86b3322ddd5f13',
        email: 'judareiro@gmail.com',
        firstName: 'Juan',
        middleName: 'David',
        lastName: 'Reina',
        address: 'Cra 37B',
        city: 'Palmira',
        birthday: '13/09/1990',
        userImg: '',
        username: 'judareiro',
        password: '$2b$10$xt3FQTzAKyvSBBbBOAFlk.szCCgABN7Hl8ItQdPSDLM/xJeRiccyO',
        maritalStatusId: '64fb19baf0326bb9e6823380',
        ocupationId: '64fcb828b8224d148e5ea6ff',
        roleId: '64f9f639f10ace762d2896b6',
        status: true,
        lastLogin: '',
        createdAt: '2023-09-08T14:32:47.040Z',
        updatedAt: '2023-09-17T04:44:47.246Z',
        genderId: '64fcb828b8224d148e5ea6e6',
        id: '64fb308f4751d652d08903d0',
      },
      status: true,
      createdAt: '2023-09-15T05:44:17.840Z',
      updatedAt: '2023-09-15T05:44:17.840Z',
      id: '6503ef3131e64335e124fd55',
    },
  ],
};

// Mock Create a new Contract appends
export const createdContractor: Partial<CreateContractAppendDto> = {
  title: 'Append #1',
  content: 'This is the content example',
  createdByUserId: '64fb308f4751d652d08903d0',
};
