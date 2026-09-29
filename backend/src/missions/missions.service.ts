import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mission, MissionDocument } from '../schemas/mission.schema.js';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Team, TeamDocument } from '../schemas/team.schema.js';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto.js';

@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission.name) private missionModel: Model<MissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
  ) {}

  async create(dto: CreateMissionDto, userId: string): Promise<MissionDocument> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.teamId) throw new BadRequestException('У вас немає команди для створення місії');

    const mission = new this.missionModel({ ...dto, teamId: user.teamId });
    return mission.save();
  }

  async findAll(userId: string): Promise<MissionDocument[]> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.teamId) return [];

    return this.missionModel.find({ teamId: user.teamId }).populate('teamId', 'name').populate('members applicants', 'name email avatar role').sort({ createdAt: -1 }).exec();
  }

  async findAllGlobalMissions(): Promise<MissionDocument[]> {
    return this.missionModel
      .find({})
      .populate('teamId', 'name')
      .populate('members applicants', 'name email avatar role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<MissionDocument> {
    const mission = await this.missionModel.findById(id).populate('members applicants', 'name email avatar role').exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async update(id: string, dto: UpdateMissionDto): Promise<MissionDocument> {
    const mission = await this.missionModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('members applicants', 'name email avatar role')
      .exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async delete(id: string): Promise<void> {
    const result = await this.missionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Mission not found');
  }

  async joinMission(missionId: string, userId: string, role?: string): Promise<MissionDocument> {
    const isInstant = role === 'COORDINATOR' || role === 'ADMIN';
    const update = isInstant 
      ? { $addToSet: { members: userId }, $pull: { applicants: userId } }
      : { $addToSet: { applicants: userId } };
      
    const mission = await this.missionModel.findByIdAndUpdate(
      missionId,
      update,
      { new: true }
    ).populate('members applicants', 'name email avatar role').exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async leaveMission(missionId: string, userId: string): Promise<MissionDocument> {
    const mission = await this.missionModel.findByIdAndUpdate(
      missionId,
      { $pull: { members: userId, applicants: userId } },
      { new: true }
    ).populate('members applicants', 'name email avatar role').exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async approveApplicant(missionId: string, applicantId: string): Promise<MissionDocument> {
    const mission = await this.missionModel.findByIdAndUpdate(
      missionId,
      { 
        $addToSet: { members: applicantId },
        $pull: { applicants: applicantId }
      },
      { new: true }
    ).populate('members applicants', 'name email avatar role').exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async rejectApplicant(missionId: string, applicantId: string): Promise<MissionDocument> {
    const mission = await this.missionModel.findByIdAndUpdate(
      missionId,
      { $pull: { applicants: applicantId } },
      { new: true }
    ).populate('members applicants', 'name email avatar role').exec();
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }
}
