import { Test, TestingModule } from '@nestjs/testing';
import { ContractorsController } from '../../../src/modules/contractors/contractors.controller';
import { ContractorsService } from '../../../src/modules/contractors/contractors.service';

describe('ContractorsController', () => {
  let controller: ContractorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractorsController],
      providers: [ContractorsService],
    }).compile();

    controller = module.get<ContractorsController>(ContractorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
