import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  assignees: Types.ObjectId[];

  @Prop({ type: Number, default: null })
  maxAssignees: number | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mission', default: null })
  mission: Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @Prop({ type: String, default: '' })
  location: string;

  @Prop({
    type: [
      {
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: { text: string; author: Types.ObjectId; createdAt: Date }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
