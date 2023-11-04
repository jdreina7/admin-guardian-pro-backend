import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';

export const mockContractsService = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
  findByIdAndDelete: jest.fn(),
  select: jest.fn(),
};

export const mockAllContracts = {
  success: true,
  data: [
    {
      contractNumber: 13,
      contractorId: {
        userId: '64fcc2a26e45b152a7cd25dd',
        id: '6504dd7a38caeebe4f47966a',
      },
      contractHolderuserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      contractUrl: 'HolamundRRRo33.com',
      createdByUserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      status: true,
      contractVersion: 5,
      contractAppendsId: {
        title: 'Append #1',
        id: '6503ef3131e64335e124fd55',
      },
      contractStartDate: 'Sun Sep 17 2023 00:00:00 GMT-0500 (hora estándar de Colombia)',
      contractEndDate: 'Tue Dec 12 2023 19:00:00 GMT-0500 (hora estándar de Colombia)',
      id: '6504ebbfe4f1004a05561685',
    },
    {
      contractNumber: 3,
      contractorId: {
        userId: '64fcc2a26e45b152a7cd25dd',
        id: '6504dd7a38caeebe4f47966a',
      },
      contractHolderuserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      contractUrl: 'Ho3.com',
      createdByUserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      status: true,
      contractVersion: 2,
      contractAppendsId: {
        title: 'Append #1',
        id: '6503ef3131e64335e124fd55',
      },
      contractStartDate: 'Sun Sep 17 2023 00:00:00 GMT-0500 (hora estándar de Colombia)',
      contractEndDate: 'Tue Dec 12 2023 19:00:00 GMT-0500 (hora estándar de Colombia)',
      id: '6504ed6edd4d4f7094bce23e',
    },
    {
      contractNumber: 9,
      contractorId: {
        userId: '64fcc2a26e45b152a7cd25dd',
        id: '6504dd7a38caeebe4f47966a',
      },
      contractHolderuserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      contractUrl: 'Ho3.com',
      createdByUserId: {
        uid: 123456,
        id: '64fcc2a26e45b152a7cd25dd',
      },
      status: true,
      contractVersion: 2,
      contractAppendsId: {
        title: 'Append #1',
        id: '6503ef3131e64335e124fd55',
      },
      contractStartDate: 'Sun Sep 17 2023 00:00:00 GMT-0500 (hora estándar de Colombia)',
      contractEndDate: 'Tue Dec 12 2023 19:00:00 GMT-0500 (hora estándar de Colombia)',
      id: '6504ed75dd4d4f7094bce250',
    },
  ],
};

// Mock for a one Contract
export const mockOneContract = {
  success: true,
  data: {
    contractNumber: 13,
    contractorId: {
      userId: '64fcc2a26e45b152a7cd25dd',
      id: '6504dd7a38caeebe4f47966a',
    },
    contractHolderuserId: {
      uid: 123456,
      id: '64fcc2a26e45b152a7cd25dd',
    },
    contractUrl: 'HolamundRRRo33.com',
    createdByUserId: {
      uid: 123456,
      id: '64fcc2a26e45b152a7cd25dd',
    },
    status: true,
    contractVersion: 5,
    contractAppendsId: {
      title: 'Append #1',
      id: '6503ef3131e64335e124fd55',
    },
    contractStartDate: 'Sun Sep 17 2023 00:00:00 GMT-0500 (hora estándar de Colombia)',
    contractEndDate: 'Tue Dec 12 2023 19:00:00 GMT-0500 (hora estándar de Colombia)',
    id: '6504ebbfe4f1004a05561685',
  },
};

// Mock Create a new Contract
export const createdRol: Partial<CreateContractDto> = {
  contractNumber: 2245,
  contractorId: '6504dd7a38caeebe4f47966a',
  contractHolderuserId: '64fcc2a26e45b152a7cd25dd',
  createdByUserId: '64fcc2a26e45b152a7cd25dd',
  contractAppendsId: '6503ef3131e64335e124fd55',
  contractUrl: 'Holamundo.com',
  contractVersion: 2,
  contractStartDate: new Date('2023/09/16'),
  contractEndDate: new Date('2023-12-12'),
};
