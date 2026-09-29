import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto.js';
import { MissionsService } from './missions.service.js';
import { TeamAccessGuard, Roles } from '../auth/guards/team-access.guard.js';
import { UserRole } from '../schemas/user.schema.js';

@Controller('missions')
@UseGuards(AuthGuard('jwt'), TeamAccessGuard)
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @Roles(UserRole.COORDINATOR)
  create(@Body() dto: CreateMissionDto, @Request() req: any) {
    return this.missionsService.create(dto, req.user._id.toString());
  }

  @Get()
  findAll(@Request() req: any, @Query('all') all?: string) {
    if (all === 'true') {
      return this.missionsService.findAllGlobalMissions();
    }
    return this.missionsService.findAll(req.user._id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMissionDto) {
    return this.missionsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.missionsService.delete(id);
  }

  @Post(':id/join')
  joinMission(@Param('id') id: string, @Request() req: { user: { _id: string, role: string } }) {
    return this.missionsService.joinMission(id, req.user._id.toString(), req.user.role);
  }

  @Post(':id/leave')
  leaveMission(@Param('id') id: string, @Request() req: { user: { _id: string } }) {
    return this.missionsService.leaveMission(id, req.user._id.toString());
  }

  @Post(':id/approve/:userId')
  approveApplicant(@Param('id') id: string, @Param('userId') userId: string) {
    return this.missionsService.approveApplicant(id, userId);
  }

  @Post(':id/reject/:userId')
  rejectApplicant(@Param('id') id: string, @Param('userId') userId: string) {
    return this.missionsService.rejectApplicant(id, userId);
  }
}
