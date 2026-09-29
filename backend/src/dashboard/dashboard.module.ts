import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema.js';
import { Task, TaskSchema } from '../schemas/task.schema.js';
import { Mission, MissionSchema } from '../schemas/mission.schema.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Mission.name, schema: MissionSchema },
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
