import { Test, TestingModule } from '@nestjs/testing';
import { ContractAppendsController } from '../../../src/modules/contract-appends/contract-appends.controller';
import { ContractAppendsService } from '../../../src/modules/contract-appends/contract-appends.service';

describe('ContractAppendsController', () => {
  let controller: ContractAppendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractAppendsController],
      providers: [ContractAppendsService],
    }).compile();

    controller = module.get<ContractAppendsController>(ContractAppendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
