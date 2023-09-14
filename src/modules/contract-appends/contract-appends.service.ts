import { Injectable } from '@nestjs/common';
import { CreateContractAppendDto } from './dto/create-contract-append.dto';
import { UpdateContractAppendDto } from './dto/update-contract-append.dto';

@Injectable()
export class ContractAppendsService {
  create(createContractAppendDto: CreateContractAppendDto) {
    return 'This action adds a new contractAppend';
  }

  findAll() {
    return `This action returns all contractAppends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contractAppend`;
  }

  update(id: number, updateContractAppendDto: UpdateContractAppendDto) {
    return `This action updates a #${id} contractAppend`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractAppend`;
  }
}
