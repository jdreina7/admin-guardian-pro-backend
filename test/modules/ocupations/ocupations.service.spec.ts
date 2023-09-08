import { Test, TestingModule } from '@nestjs/testing';
import { OcupationsService } from '../../../src/modules/ocupations/ocupations.service';

describe('OcupationsService', () => {
  let service: OcupationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcupationsService],
    }).compile();

    service = module.get<OcupationsService>(OcupationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
