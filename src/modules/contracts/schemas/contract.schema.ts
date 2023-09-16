import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret.__v;
      delete ret._id;
    },
  },
  timestamps: true,
})
export class Contract extends mongoose.Document {
  @Prop({
    index: true,
    unique: true,
  })
  contractNumber: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
  })
  contractorId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  contractHolderuserId: mongoose.Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  contractUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdByUserId: mongoose.Types.ObjectId;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop()
  contractVersion: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractAppend',
  })
  contractAppendsId: mongoose.Types.ObjectId;

  @Prop()
  contractStartDate: string;

  @Prop()
  contractEndDate: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
