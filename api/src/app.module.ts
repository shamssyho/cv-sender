import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeleniumModule } from './selenium/selenium.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'shams',
      password: 'shams1289',
      database: 'cv-sender',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    SeleniumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
