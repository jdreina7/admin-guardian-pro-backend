import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

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
export class Documents extends mongoose.Document {
  @Prop({
    required: true,
  })
  documentName: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentType',
    index: true,
    required: true,
  })
  documentTypeId: mongoose.Types.ObjectId;

  @Prop()
  description: string;

  @Prop({
    required: true,
  })
  documentUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  userOwnerId: mongoose.Types.ObjectId;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop()
  documentVersion: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Documents);
