import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema.js';
import { Mission, MissionSchema } from '../schemas/mission.schema.js';
import { Team, TeamSchema } from '../schemas/team.schema.js';
import { MissionsController } from './missions.controller.js';
import { MissionsService } from './missions.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mission.name, schema: MissionSchema },
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema }
    ]),
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}
