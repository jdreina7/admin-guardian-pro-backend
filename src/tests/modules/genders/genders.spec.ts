import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { GendersController } from '../../../modules/genders/genders.controller';
import { GendersService } from '../../../modules/genders/genders.service';
import { Gender } from '../../../modules/genders/schemas/gender.schema';
import { MockAuthModule } from '../../../tests/mocks/mockAuthModule.mock';
import { createdGender, mockGendersService, mockOneGender } from '../../../tests/mocks/mockGenders.mock';

describe('Test genders controller', () => {
  let gendersController: GendersController;
  let gendersServices: GendersService;
  let gendersModel: Model<Gender>;

  let result: any = {};
  //let errorResult: any = {};
  //let { id } = mockOneGender.data;

  beforeEach(async () => {
    const gendersModule: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        GendersService,
        {
          provide: getModelToken(Gender.name),
          useValue: mockGendersService,
        },
      ],
      controllers: [GendersController],
    }).compile();

    gendersController = gendersModule.get<GendersController>(GendersController);
    gendersServices = gendersModule.get<GendersService>(GendersService);
    gendersModel = gendersModule.get<Model<Gender>>(getModelToken(Gender.name));

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
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('1.Test Creating a new Gender', () => {
    it('1.1 Controller.create must return the new created gender', async () => {
      jest.spyOn(mockGendersService, 'customCapitalizeFirstLetter').mockReturnValue(mockOneGender.data.name);
      jest.spyOn(gendersModel, 'create').mockResolvedValue(mockOneGender as any);

      result = await gendersController.create(createdGender as any);

      expect(result?.success).toBeTruthy();
      expect(result?.data).toBeDefined();
      expect(result?.data).toBe(mockOneGender);
      expect(mockGendersService.create).toHaveBeenCalledTimes(1);

      jest.spyOn(mockGendersService, 'customCapitalizeFirstLetter').mockClear();
      jest.spyOn(gendersModel, 'create').mockClear();
    });
    //it('', async () => {});
  });
  //describe('Testing Gender.', () => { second })
  //describe('Testing Gender.', () => { second })
  //describe('Testing Gender.', () => { second })
  //describe('Testing Gender.', () => { second })
});
