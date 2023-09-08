import { Test, TestingModule } from '@nestjs/testing';
import { OcupationsController } from '../../../src/modules/ocupations/ocupations.controller';
import { OcupationsService } from '../../../src/modules/ocupations/ocupations.service';

describe('OcupationsController', () => {
  let controller: OcupationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcupationsController],
      providers: [OcupationsService],
    }).compile();

    controller = module.get<OcupationsController>(OcupationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
