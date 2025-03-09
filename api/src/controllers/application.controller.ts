import { Get, Body, Post, Controller } from '@nestjs/common';
import { CreateApplicationDto } from 'src/dto/create-application.dto';
import { AutomationService } from 'src/services/automation.service';
import { ApplicationService } from 'src/services/application.service';

@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly automationService: AutomationService,
  ) {}

  @Post('apply')
  async apply(@Body() dto: CreateApplicationDto) {
    const result = await this.automationService.apply(
      dto.platform,
      dto.jobUrl,
      dto.cvPath,
    );
    if (result.success) {
      return this.applicationService.create(dto);
    }
    return { message: 'Candidature échouée' };
  }

  @Get('history')
  getHistory() {
    return this.applicationService.findAll();
  }
}
