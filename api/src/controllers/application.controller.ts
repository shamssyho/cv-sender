import {
  Get,
  Body,
  Post,
  InternalServerErrorException,
  Controller,
} from '@nestjs/common';
import { CreateApplicationDto } from 'src/dto/create-application.dto';
import { AutomationService } from 'src/services/automation.service';
import { ApplicationService } from 'src/services/application.service';

@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly automationService: AutomationService, // ✅ Injection correcte
  ) {}

  @Post('apply')
  async apply(@Body() dto: CreateApplicationDto) {
    try {
      const result = await this.automationService.apply(
        dto.platform,
        dto.jobUrl,
        dto.cvPath,
      );

      if (result.success) {
        await this.applicationService.create({
          platform: dto.platform,
          jobTitle: result.jobTitle,
          status: 'success',
          cvPath: dto.cvPath || '',
        } as CreateApplicationDto);

        return { message: 'Candidature envoyée avec CV 👍' };
      } else {
        return { message: 'Échec de la candidature 👎' };
      }
    } catch {
      throw new InternalServerErrorException('Automation failed');
    }
  }

  @Get('history')
  getHistory() {
    return this.applicationService.findAll();
  }
}
