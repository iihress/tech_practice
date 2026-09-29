import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { UsersModule } from './users/users.module.js';
import { MissionsModule } from './missions/missions.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { TeamsModule } from './teams/teams.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/volunteer_hub',
    ),
    AuthModule,
    TasksModule,
    UsersModule,
    DashboardModule,
    MissionsModule,
    NotificationsModule,
    TeamsModule,
  ],
})
export class AppModule {}
