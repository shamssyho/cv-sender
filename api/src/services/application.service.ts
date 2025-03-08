import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { Repository } from 'typeorm';
import { Builder } from 'selenium-webdriver';
import { AutomationService } from 'src/services/automation.service'; // ✅ Ajout de l'import
import { CreateApplicationDto } from 'src/dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>, // repo TypeORM injecté

    private readonly automationService: AutomationService, // ✅ Injection corrigée
  ) {}

  async create(application: CreateApplicationDto): Promise<Application> {
    const newApp = this.appRepo.create(application);
    return this.appRepo.save(newApp);
  }

  findAll(): Promise<Application[]> {
    return this.appRepo.find(); // récupère tout l'historique
  }

  async startAutomation(jobTitle: string, cvPath: string) {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
      await this.automationService.loginLinkedIn(driver);
      const result = await this.automationService.applyForJob(
        driver,
        jobTitle,
        cvPath,
      ); // ✅ Ajout de `cvPath`
      return result;
    } catch (error) {
      console.error("❌ Erreur pendant l'automatisation :", error);
      return { success: false, jobTitle: 'Erreur' };
    } finally {
      await driver.quit();
    }
  }
}
