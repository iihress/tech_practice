import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema.js';
import { Mission, MissionSchema } from '../schemas/mission.schema.js';
import { Team, TeamSchema } from '../schemas/team.schema.js';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Mission.name, schema: MissionSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
