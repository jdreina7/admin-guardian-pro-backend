import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


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

export class Credential extends Document {
    @Prop({
        index: true,
        unique: true,
        required: true
    })
    type: string;

    @Prop()
    description: string;

    @Prop({
        default: true
    })
    status: boolean;
}


export const CredentialSchema = SchemaFactory.createForClass( Credential );