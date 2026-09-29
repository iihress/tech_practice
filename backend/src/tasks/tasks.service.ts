import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';

import { Mission, MissionDocument } from '../schemas/mission.schema.js';
import { UserRole } from '../schemas/user.schema.js';
import { Team, TeamDocument } from '../schemas/team.schema.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Mission.name) private missionModel: Model<MissionDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
  ) {}

  async create(dto: CreateTaskDto, authorId: string) {
    return this.taskModel.create({ ...dto, author: authorId });
  }

  async findAll(filters?: { status?: TaskStatus; mission?: string }, user?: any) {
    const query: Record<string, unknown> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.mission) {
      query.mission = new Types.ObjectId(filters.mission);
    } else if (user) {
      const teams = await this.teamModel.find({ members: new Types.ObjectId(user._id) }).select('_id');
      const teamIds = teams.map(t => t._id);
      
      const userMissions = await this.missionModel.find({ teamId: { $in: teamIds } }).select('_id');
      const userMissionIds = userMissions.map(m => m._id);
      
      query.mission = { $in: userMissionIds };
    }
    return this.taskModel
      .find(query)
      .populate('assignees', 'name email avatar role')
      .populate('author', 'name email avatar role')
      .populate({
        path: 'mission',
        select: 'name teamId',
        populate: {
          path: 'teamId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate('assignees', 'name email avatar role')
      .populate('author', 'name email avatar role')
      .populate('comments.author', 'name email avatar role');
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('assignees', 'name email avatar role')
      .populate('author', 'name email avatar role')
      .populate('comments.author', 'name email avatar role');
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async addComment(taskId: string, authorId: string, text: string) {
    const task = await this.taskModel.findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: { text, author: authorId },
        },
      },
      { new: true },
    ).populate('comments.author', 'name email avatar role');
    
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteComment(taskId: string, commentId: string) {
    const task = await this.taskModel.findByIdAndUpdate(
      taskId,
      {
        $pull: {
          comments: { _id: commentId },
        },
      } as any,
      { new: true },
    ).populate('comments.author', 'name email avatar role');

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async delete(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new NotFoundException('Task not found');
    return { success: true };
  }

  async deleteByMission(missionId: string) {
    await this.taskModel.deleteMany({ mission: missionId });
    return { success: true };
  }

  async getKanbanBoard(missionId?: string, user?: any) {
    const query: Record<string, unknown> = {};
    if (missionId) {
      query.mission = new Types.ObjectId(missionId);
    } else {
      if (user && user.role === UserRole.VOLUNTEER) {
        // If volunteer and no specific mission requested, only show tasks from their missions
        const userMissions = await this.missionModel.find({ members: new Types.ObjectId(user._id) }).select('_id');
        const userMissionIds = userMissions.map(m => m._id);
        query.mission = { $in: userMissionIds };
      }
      // If admin/coordinator, they can see all tasks for the team (which we currently assume are all tasks in DB since we haven't scoped tasks to team yet).
    }

    const tasks = await this.taskModel
      .find(query)
      .populate('assignees', 'name email avatar role')
      .sort({ createdAt: -1 });

    const board = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    for (const task of tasks) {
      board[task.status].push(task as never);
    }

    return board;
  }
}
