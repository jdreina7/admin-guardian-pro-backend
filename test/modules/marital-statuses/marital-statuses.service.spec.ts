import { Test, TestingModule } from '@nestjs/testing';
import { MaritalStatusesService } from '../../../src/modules/marital-statuses/marital-statuses.service';

describe('MaritalStatusesService', () => {
  let service: MaritalStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaritalStatusesService],
    }).compile();

    service = module.get<MaritalStatusesService>(MaritalStatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
