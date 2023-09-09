import { Test, TestingModule } from '@nestjs/testing';
import { GendersService } from '../../../src/modules/genders/genders.service';

describe('GendersService', () => {
  let service: GendersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GendersService],
    }).compile();

    service = module.get<GendersService>(GendersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
