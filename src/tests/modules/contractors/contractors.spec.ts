import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';

import { Contractor, ContractorsController, ContractorsService } from '../../../modules/contractors';
import { LoginService, User, UsersService } from '../../../modules/users';
import { mockContractorsService, mockUserService } from '../../../tests/mocks';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import { createdContractor, mockOneContractor } from '../../../tests/mocks/mockContractorsService.mock';
import { mockOneUser } from '../../../tests/mocks/mockUsersService.mock';
import { DocumentType, DocumentTypesService } from '../../../modules/document-types';
import { MaritalStatus, MaritalStatusesService } from '../../../modules/marital-statuses';
import { Rol, RolesService } from '../../../modules/roles';
import { Ocupation, OcupationsService } from '../../../modules/ocupations';
import { IdentificationTypes, IdentificationsTypesService } from '../../../modules/identificationsTypes';
import { Gender, GendersService } from '../../../modules/genders';
import { mockDocumentTypeService, mockOneDocType } from '../../../tests/mocks/mockDocumentTypeService.mock';
import { mockMaritalStatusService, mockOneMaritalStatus } from '../../../tests/mocks/mockMaritalStatus.mock';
import { mockRol, mockRolService } from '../../../tests/mocks/mockRolesService.mock';
import { mockOcupationService, mockOneOcupation } from '../../../tests/mocks/mockOcupationService.mock';
import { mockIDTypesService, mockOneIDTypes } from '../../../tests/mocks/mockIDtypesService.mock';
import { mockGenderService, mockOneGender } from '../../../tests/mocks/mockGenderService.mock';

describe('Contractors Module Test', () => {
  let contractorsController: ContractorsController;
  let contractorsService: ContractorsService;
  let contractorsModel: Model<Contractor>;

  let docTypeService: DocumentTypesService;
  let maritalStatusesService: MaritalStatusesService;
  let rolesService: RolesService;
  let ocupationsService: OcupationsService;
  let identificationsTypesService: IdentificationsTypesService;
  let gendersService: GendersService;
  let userModel: Model<User>;
  let userService: UsersService;
  //let { id } = mockOneContractor.data;
  let result: any = {};
  //let errorResult: any = {};

  beforeEach(async () => {
    const contractorsModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginService,
        JwtService,
        ContractorsService,
        UsersService,

        DocumentTypesService,
        MaritalStatusesService,
        RolesService,
        OcupationsService,
        IdentificationsTypesService,
        GendersService,
        {
          provide: getModelToken(Contractor.name),
          useValue: mockContractorsService,
        },
        {
          provide: getModelToken(DocumentType.name),
          useValue: mockDocumentTypeService,
        },
        {
          provide: getModelToken(MaritalStatus.name),
          useValue: mockMaritalStatusService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
        {
          provide: getModelToken(Rol.name),
          useValue: mockRolService,
        },
        {
          provide: getModelToken(Ocupation.name),
          useValue: mockOcupationService,
        },
        {
          provide: getModelToken(IdentificationTypes.name),
          useValue: mockIDTypesService,
        },
        {
          provide: getModelToken(Gender.name),
          useValue: mockGenderService,
        },
      ],
      controllers: [ContractorsController],
    }).compile();

    contractorsController = contractorsModule.get<ContractorsController>(ContractorsController);
    contractorsService = contractorsModule.get<ContractorsService>(ContractorsService);
    contractorsModel = contractorsModule.get<Model<Contractor>>(getModelToken(Contractor.name));

    userModel = contractorsModule.get<Model<User>>(getModelToken(User.name));
    userService = contractorsModule.get<UsersService>(UsersService);
    maritalStatusesService = contractorsModule.get<MaritalStatusesService>(MaritalStatusesService);
    rolesService = contractorsModule.get<RolesService>(RolesService);
    ocupationsService = contractorsModule.get<OcupationsService>(OcupationsService);
    identificationsTypesService = contractorsModule.get<IdentificationsTypesService>(IdentificationsTypesService);
    gendersService = contractorsModule.get<GendersService>(GendersService);
    docTypeService = contractorsModule.get<DocumentTypesService>(DocumentTypesService);

    jest.mock('./../../../common/decorators/auth.decorator.ts', () => {
      return {
        AuthModule: {
          forRootAsync: jest.fn().mockImplementation(() => MockAuthModule),
        },
        PassportModule: {
          forRootAsync: jest.fn().mockImplementation(() => MockAuthModule),
        },
      };
    });

    jest.spyOn(userService, 'findOne').mockResolvedValue(mockOneUser as any);
    jest.spyOn(docTypeService, 'findOne').mockResolvedValue(mockOneDocType as any);
    jest.spyOn(maritalStatusesService, 'findOne').mockResolvedValue(mockOneMaritalStatus as any);
    jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRol as any);
    jest.spyOn(ocupationsService, 'findOne').mockResolvedValue(mockOneOcupation as any);
    jest.spyOn(identificationsTypesService, 'findOne').mockResolvedValue(mockOneIDTypes as any);
    jest.spyOn(gendersService, 'findOne').mockResolvedValue(mockOneGender as any);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1. Test create Contractor', () => {
    it('1.1 Controller.Create must return a new Contractor created', async () => {
      jest.spyOn(contractorsModel, 'create').mockResolvedValue(mockOneContractor as any);
      //jest.spyOn(contractorsModel, 'create').mockResolvedValue(mockOneContractor as any);

      result = await contractorsController.create(createdContractor as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneContractor);
      expect(mockContractorsService.mockContractorsService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(contractorsModel, 'create').mockClear();
    });
  });
});
