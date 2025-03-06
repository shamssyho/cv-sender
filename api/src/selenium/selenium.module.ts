import { Module } from '@nestjs/common';
import { SeleniumService } from './selenium.service';
import { SeleniumController } from './selenium.controller';

@Module({
  providers: [SeleniumService],
  controllers: [SeleniumController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
