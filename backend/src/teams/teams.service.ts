import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, TeamDocument } from '../schemas/team.schema.js';
import { User, UserDocument, UserRole } from '../schemas/user.schema.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createTeam(name: string, userId: string) {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const team = new this.teamModel({
      name,
      inviteCode,
      coordinator: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    });
    
    const savedTeam = await team.save();

    const user = await this.userModel.findById(userId);
    const newRole = user?.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.COORDINATOR;

    await this.userModel.findByIdAndUpdate(userId, { 
      teamId: savedTeam._id,
      role: newRole
    });
    
    return savedTeam;
  }

  async joinTeam(inviteCode: string, userId: string) {
    const team = await this.teamModel.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!team) throw new NotFoundException('Команду не знайдено за цим кодом');

    const userObjId = new Types.ObjectId(userId);
    if (team.members.some(id => id.toString() === userId)) {
      throw new BadRequestException('Ви вже є учасником цієї команди');
    }

    team.members.push(userObjId);
    await team.save();

    await this.userModel.findByIdAndUpdate(userId, { teamId: team._id });

    return team;
  }

  async getMyTeam(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.teamId) return null;
    return this.teamModel.findById(user.teamId).populate('members', 'name email role avatar');
  }

  async regenerateInviteCode(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.teamId) throw new BadRequestException('У вас немає команди');

    const team = await this.teamModel.findById(user.teamId);
    if (!team) throw new NotFoundException('Команда не знайдена');
    if (team.coordinator.toString() !== userId) {
      throw new BadRequestException('Тільки координатор може змінити код');
    }

    team.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await team.save();
    return team;
  }

  async removeMember(userId: string, memberId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.teamId) throw new BadRequestException('У вас немає команди');

    const team = await this.teamModel.findById(user.teamId);
    if (!team) throw new NotFoundException('Команда не знайдена');
    if (team.coordinator.toString() !== userId) {
      throw new BadRequestException('Тільки координатор може видаляти учасників');
    }

    if (memberId === userId) {
      throw new BadRequestException('Не можна видалити себе');
    }

    team.members = team.members.filter(id => id.toString() !== memberId);
    await team.save();

    await this.userModel.findByIdAndUpdate(memberId, { teamId: null });
    return team;
  }

  async getUserTeams(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    return this.teamModel.find({ members: userObjId }).select('_id name');
  }

  async switchTeam(userId: string, newTeamId: string) {
    const userObjId = new Types.ObjectId(userId);
    const newTeamObjId = new Types.ObjectId(newTeamId);

    const team = await this.teamModel.findOne({ _id: newTeamObjId, members: userObjId });
    if (!team) throw new BadRequestException('Ви не є учасником цієї команди');

    const user = await this.userModel.findById(userId);
    let newRole = UserRole.VOLUNTEER;
    if (user?.role === UserRole.ADMIN) {
      newRole = UserRole.ADMIN;
    } else if (team.coordinator.toString() === userId) {
      newRole = UserRole.COORDINATOR;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, { 
      teamId: team._id,
      role: newRole
    }, { new: true }).select('-passwordHash');

    if (!updatedUser) throw new NotFoundException('User not found');

    return { 
      success: true, 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        teamId: updatedUser.teamId,
      }
    };
  }

  async deleteTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findById(teamId);
    if (!team) throw new NotFoundException('Команда не знайдена');
    
    const user = await this.userModel.findById(userId);
    const isAdmin = user?.role === UserRole.ADMIN;

    if (team.coordinator.toString() !== userId && !isAdmin) {
      throw new BadRequestException('Тільки координатор або адміністратор може видаляти команду');
    }

    // Unassign users from this team
    await this.userModel.updateMany(
      { teamId: team._id },
      { $set: { teamId: null, role: UserRole.VOLUNTEER } } // Reset role
    );

    // Give the current user their roles back if they were an admin
    if (isAdmin) {
      await this.userModel.findByIdAndUpdate(userId, { role: UserRole.ADMIN });
    }

    // Delete the team
    await this.teamModel.findByIdAndDelete(teamId);
    
    // Also delete missions of this team
    // await this.missionModel.deleteMany({ team: teamId });
    // await this.taskModel.deleteMany({ mission: { $in: missionIds } });

    return { success: true };
  }
}
