import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

export enum MissionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

@Schema({ timestamps: true })
export class Mission {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, enum: MissionStatus, default: MissionStatus.ACTIVE })
  status: MissionStatus;

  @Prop({ type: Number, default: null })
  budget: number | null;

  @Prop({ type: Number, default: 0 })
  collected: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  applicants: Types.ObjectId[];

  @Prop({ type: String, default: '' })
  location: string;

  @Prop({ type: String, default: '' })
  photo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true })
  teamId: Types.ObjectId;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);
