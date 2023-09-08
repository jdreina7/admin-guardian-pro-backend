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
export class User extends mongoose.Document {
  @Prop({
    type: Number,
    unique: true,
    index: true,
    required: true,
  })
  uid: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IdentificationType',
    required: true,
  })
  identificationTypeId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    index: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop()
  middleName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    type: Number,
  })
  contactPhone: number;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  birthday: string;

  @Prop()
  userImg: string;

  @Prop()
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaritalStatuses',
    required: true,
  })
  maritalStatusId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ocupation',
    required: true,
  })
  ocupationId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    required: true,
  })
  roleId: mongoose.Types.ObjectId;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop()
  lastLogin: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ uid: 1, type: -1 });
UserSchema.index({ email: 1, type: -1 });
