import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { ApplicationService } from 'src/services/application.service';
import { AutomationService } from 'src/services/automation.service';
import { ApplicationController } from 'src/controllers/application.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'shams',
      password: 'shams1289',
      database: 'cv-sender',
      entities: [Application],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Application]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, AutomationService],
  exports: [ApplicationService, AutomationService],
})
export class AppModule {}
