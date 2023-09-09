import { Test, TestingModule } from '@nestjs/testing';
import { GendersController } from '../../../src/modules/genders/genders.controller';
import { GendersService } from '../../../src/modules/genders/genders.service';

describe('GendersController', () => {
  let controller: GendersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GendersController],
      providers: [GendersService],
    }).compile();

    controller = module.get<GendersController>(GendersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
