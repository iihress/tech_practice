import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatus } from '../schemas/task.schema.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: { user: { _id: string } }) {
    return this.tasksService.create(dto, req.user._id.toString());
  }

  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('mission') mission?: string,
    @Request() req?: any,
  ) {
    return this.tasksService.findAll({ status, mission }, req?.user);
  }

  @Get('board')
  getBoard(@Query('mission') mission?: string, @Request() req?: any) {
    return this.tasksService.getKanbanBoard(mission, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body('text') text: string,
    @Request() req: { user: { _id: string } },
  ) {
    return this.tasksService.addComment(id, req.user._id.toString(), text);
  }

  @Delete(':id/comments/:commentId')
  deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.tasksService.deleteComment(id, commentId);
  }

  @Delete('mission/:missionId')
  deleteByMission(@Param('missionId') missionId: string) {
    return this.tasksService.deleteByMission(missionId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
