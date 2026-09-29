import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from '../schemas/notification.schema.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, title: string, message: string, type: NotificationType = NotificationType.INFO): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      user: userId,
      title,
      message,
      type,
    });
    return notification.save();
  }

  async findByUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ user: userId }).sort({ createdAt: -1 }).limit(20).exec();
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    ).exec();
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    ).exec();
  }
}
