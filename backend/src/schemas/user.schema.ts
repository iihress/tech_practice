import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  VOLUNTEER = 'VOLUNTEER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.VOLUNTEER })
  role: UserRole;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null })
  teamId: Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
