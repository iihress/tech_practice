import { Controller, Get, Param, Patch, Request, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req: { user: { _id: string } }) {
    return this.notificationsService.findByUser(req.user._id.toString());
  }

  @Post()
  create(@Body() body: { userId: string, title: string, message: string, type?: string }) {
    // Ideally this should be restricted, but for simplicity:
    return this.notificationsService.create(body.userId, body.title, body.message, body.type as any);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: { user: { _id: string } }) {
    return this.notificationsService.markAsRead(id, req.user._id.toString());
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: { user: { _id: string } }) {
    return this.notificationsService.markAllAsRead(req.user._id.toString());
  }
}
