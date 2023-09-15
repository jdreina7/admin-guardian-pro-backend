import { PartialType } from '@nestjs/mapped-types';
import { CreateContractAppendDto } from './create-contract-append.dto';

export class UpdateContractAppendDto extends PartialType(CreateContractAppendDto) {}
