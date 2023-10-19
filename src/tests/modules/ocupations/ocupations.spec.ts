import { Model } from 'mongoose';
import { OcupationsController } from '../../../modules/ocupations/ocupations.controller';
import { OcupationsService } from '../../../modules/ocupations/ocupations.service';
import { Ocupation } from '../../../modules/ocupations/schemas/ocupation.schema';
import { mockOneOcupation } from '../../../tests/mocks/mockOcupationsService.mock';

describe('Marital-Status module tests', () => {
  let ocupController: OcupationsController;
  let ocupService: OcupationsService;
  let ocuModel: Model<Ocupation>;
  let { id } = mockOneOcupation.data.id;
  let errorResult: any = {};
});