import { Get, Body, Post, InternalServerErrorException } from '@nestjs/common';
import { ApplicationService } from 'src/services/application.service';

@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly automationService: AutomationService,
  ) {}

  @Post('apply')
  async apply(@Body() dto: ApplyDto) {
    // dto contient par ex: { platform: 'LinkedIn', jobUrl: '...', cvPath: '...', coverLetterPath: '...' }
    try {
      const result = await this.automationService.apply(
        dto.platform,
        dto.jobUrl,
        dto.cvPath,
        dto.coverLetterPath,
      );
      // Enregistrer le résultat (succès/échec) avec détails dans la base
      await this.applicationService.create({
        platform: dto.platform,
        jobTitle: result.jobTitle,
        status: result.success ? 'success' : 'error',
        appliedAt: new Date(),
      });
      return {
        message: result.success
          ? 'Candidature envoyée 👍'
          : 'Échec de la candidature 👎',
      };
    } catch (error) {
      // Gérer une éventuelle erreur non prévue
      throw new InternalServerErrorException('Automation failed');
    }
  }

  @Get('history')
  getHistory() {
    return this.applicationService.findAll();
  }
}
