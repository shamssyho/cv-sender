import { Controller, Post, Body } from '@nestjs/common';
import { SeleniumService } from '../services/selenium.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly seleniumService: SeleniumService) {}

  @Post('apply')
  async apply(@Body() body) {
    return await this.seleniumService.applyForJob(body.platform, body.jobTitle);
  }
}
