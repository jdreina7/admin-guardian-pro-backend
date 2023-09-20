import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from 'src/modules/roles/roles.controller';
import { RolesService } from 'src/modules/roles/roles.service';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('Probando conocimientos', () => {
    expect(2).toEqual(2 + 2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
