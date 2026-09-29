import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema.js';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema.js';
import { Mission, MissionDocument, MissionStatus } from '../schemas/mission.schema.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Mission.name) private missionModel: Model<MissionDocument>,
  ) {}

  async getStats() {
    const [
      totalVolunteers,
      activeTasks,
      completedMissions,
      activeMissions,
      tasksByStatus,
      recentTasks,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: UserRole.VOLUNTEER }),
      this.taskModel.countDocuments({ status: { $in: [TaskStatus.IN_PROGRESS, TaskStatus.TODO] } }),
      this.missionModel.countDocuments({ status: MissionStatus.COMPLETED }),
      this.missionModel.countDocuments({ status: MissionStatus.ACTIVE }),
      this.taskModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.taskModel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('assignees', 'name avatar')
        .populate('author', 'name avatar'),
    ]);

    return {
      totalVolunteers,
      activeTasks,
      completedMissions,
      activeMissions,
      tasksByStatus: tasksByStatus.reduce(
        (acc, item) => ({ ...acc, [item._id]: item.count }),
        {} as Record<string, number>,
      ),
      recentTasks,
    };
  }

  async getActivityFeed() {
    const recentTasks = await this.taskModel
      .find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate('assignees', 'name avatar')
      .populate('author', 'name avatar');

    return recentTasks.map((t) => ({
      id: t._id,
      type: 'task',
      title: t.title,
      status: t.status,
      priority: t.priority,
      assignees: t.assignees,
      author: t.author,
      updatedAt: (t as any).updatedAt,
    }));
  }
}

