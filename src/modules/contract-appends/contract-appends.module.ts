import { Module } from '@nestjs/common';
import { ContractAppendsService } from './contract-appends.service';
import { ContractAppendsController } from './contract-appends.controller';

@Module({
  controllers: [ContractAppendsController],
  providers: [ContractAppendsService],
})
export class ContractAppendsModule {}
