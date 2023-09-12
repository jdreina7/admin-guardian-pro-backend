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
  timestamps: true, // Esta linea nos ayuda a tener un guardado automatico en la creacion y actualizacion de fechas en Mongo
})
export class DocumentType extends Document {
  @Prop({
    unique: true,
    index: true,
    require: true,
  })
  type: string;

  @Prop()
  description: string;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType);
