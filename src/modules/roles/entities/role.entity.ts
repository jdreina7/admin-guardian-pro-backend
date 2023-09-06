import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

@Schema({
    // Esto oculta el campo __v y transforma el _id en id en las respuestas
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret._id;
      },
    },
  })
  
export class Rol extends Document{
    @Prop({
        unique: true,
        index: true,
        required: true
    })
    rol: string;
    
    @Prop()
    description: string;
  
    @Prop({
      default: true,
    })
    status: boolean;
  
    @Prop({
      default: moment(Date.now()).format('YYYY-MM-DD:HH:mm:ss'),
    })
    createdAt: string;
  
    @Prop()
    updatedAt: string;

}

export const RolSchema = SchemaFactory.createForClass( Rol );
