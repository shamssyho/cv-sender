import { Controller, Get, Query } from '@nestjs/common';
import { SeleniumService } from './selenium.service';

@Controller('selenium')
export class SeleniumController {
  constructor(private readonly seleniumService: SeleniumService) {}

  @Get('open-google')
  async openGoogle() {
    return this.seleniumService.openGoogle();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.seleniumService.searchGoogle(query);
  }
}
