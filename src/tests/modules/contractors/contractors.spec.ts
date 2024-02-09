import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';

import { ContractorsController, ContractorsService } from 'src/modules/contractors';
import { Contract } from 'src/modules/contracts';
import { LoginService, User, UsersService } from 'src/modules/users';
import { mockUserService } from 'src/tests/mocks';
import { mockOneContractor } from 'src/tests/mocks/mockContractorsService.mock';

describe('Contractors Module Test', () => {
  let contractorsController: ContractorsController;
  let contractorsService: ContractorsService;
  let contractorsModel: Model<Contract>;
  let userModel: Model<User>;

  let userService: UsersService;
  //let { id } = mockOneContractor.data;
  //let result: any = {};
  //let errorResult: any = {};

  beforeEach(async () => {
    const contractorsModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        LoginService,
        JwtService,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
      controllers: [ContractorsController],
    }).compile();

    contractorsController = contractorsModule.get<ContractorsController>(ContractorsController);
    contractorsService = contractorsModule.get<ContractorsService>(ContractorsService);
    userModel = contractorsModule.get<Model<User>>(getModelToken(User.name));
    userService = contractorsModule.get<UsersService>(UsersService);
  });
});
