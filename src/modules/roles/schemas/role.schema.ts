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
  
export class Rol extends Document{
    @Prop({
        unique: true,
        index: true,
        required: true
    })
    name: string;
    
    @Prop()
    description: string;
  
    @Prop({
      default: true,
    })
    status: boolean;

}

export const RolSchema = SchemaFactory.createForClass( Rol );
