import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service.js';

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body('name') name: string, @Request() req: any) {
    return this.teamsService.createTeam(name, req.user._id.toString());
  }

  @Post('join')
  join(@Body('code') code: string, @Request() req: any) {
    return this.teamsService.joinTeam(code, req.user._id.toString());
  }

  @Get('my')
  getMyTeam(@Request() req: any) {
    return this.teamsService.getMyTeam(req.user._id.toString());
  }

  @Post('regenerate-code')
  regenerateCode(@Request() req: any) {
    return this.teamsService.regenerateInviteCode(req.user._id.toString());
  }

  @Delete('members/:id')
  removeMember(@Param('id') memberId: string, @Request() req: any) {
    return this.teamsService.removeMember(req.user._id.toString(), memberId);
  }

  @Get('my-teams')
  getMyTeams(@Request() req: any) {
    return this.teamsService.getUserTeams(req.user._id.toString());
  }

  @Post('switch/:teamId')
  switchTeam(@Param('teamId') teamId: string, @Request() req: any) {
    return this.teamsService.switchTeam(req.user._id.toString(), teamId);
  }

  @Delete(':id')
  deleteTeam(@Param('id') teamId: string, @Request() req: any) {
    return this.teamsService.deleteTeam(req.user._id.toString(), teamId);
  }
}
