import { Test, TestingModule } from '@nestjs/testing';
import { MaritalStatusesController } from '../../../src/modules/marital-statuses/marital-statuses.controller';
import { MaritalStatusesService } from '../../../src/modules/marital-statuses/marital-statuses.service';

describe('MaritalStatusesController', () => {
  let controller: MaritalStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaritalStatusesController],
      providers: [MaritalStatusesService],
    }).compile();

    controller = module.get<MaritalStatusesController>(MaritalStatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
