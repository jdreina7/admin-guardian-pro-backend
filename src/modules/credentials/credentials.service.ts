import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { Credential } from './schemas/credential.schema';
import { ERR_MSG_DATA_NOT_FOUND } from 'src/utils/contants';

@Injectable()
export class CredentialsService {
  constructor(@InjectModel(Credential.name) private readonly CredentialModel: Model<Credential> ){}

  // Create a Credential
  async create(createCredentialDto: CreateCredentialDto) {
    createCredentialDto.type = createCredentialDto.type.toLowerCase();

    try {
      const createdCred = await this.CredentialModel.create(createCredentialDto);

      return{
        succes: true,
        createdCred
      }

    } catch (error) {
      return await customHandlerCatchException(error, createCredentialDto);
    }
  }

// Get all existing credentials
  async findAll() {
    try {
      const data = await this.CredentialModel.find()
      .sort({ type: 1 });
      
      return{
        data
      }

    } catch (error) {
      throw new BadRequestException(error);
    }
  }

// Find a credential by ID
  async findOne(id: string) {
    await customValidateMongoId(id);

    const existCred = await this.CredentialModel.findById(id);

    if(!existCred){
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      existCred
    }
  }

// find and update a credential by ID
  update(id: string, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

// Delete credential
  remove(id: string) {
    return `This action removes a #${id} credential`;
  }
}
