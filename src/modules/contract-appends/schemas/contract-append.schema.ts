import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  // Esto oculta el campo __v y transforma el _id en id en las respuestas
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret.__v;
      delete ret._id;
    },
  },
  timestamps: true,
})
export class ContractAppend extends Document {
  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop()
  attach: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdByUserId: mongoose.Types.ObjectId;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const ContractAppendSchema = SchemaFactory.createForClass(ContractAppend);
