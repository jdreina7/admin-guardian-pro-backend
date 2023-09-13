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
export class Contractor extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    unique: true,
    index: true,
    required: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const ContractorSchema = SchemaFactory.createForClass(Contractor);
