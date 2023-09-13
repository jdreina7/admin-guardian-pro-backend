import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
export class Documents extends Document {
  @Prop({
    required: true,
  })
  documentName: string;

  @Prop({
    index: true,
    required: true,
  })
  documentType: number;

  @Prop()
  description: string;

  @Prop({
    required: true,
  })
  documentUrl: string;

  @Prop({
    index: true,
    required: true,
  })
  userOwner: number;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop()
  documentVersion: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Documents);
