import { Test, TestingModule } from '@nestjs/testing';
import { ContractAppendsService } from './contract-appends.service';

describe('ContractAppendsService', () => {
  let service: ContractAppendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractAppendsService],
    }).compile();

    service = module.get<ContractAppendsService>(ContractAppendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
