import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  inviteCode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  coordinator: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
