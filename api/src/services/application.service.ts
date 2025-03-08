import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>, // repo TypeORM injecté
  ) {}

  async create(application: Partial<Application>): Promise<Application> {
    const app = this.appRepo.create(application);
    return this.appRepo.save(app); // enregistre la candidature en base
  }

  findAll(): Promise<Application[]> {
    return this.appRepo.find(); // récupère tout l'historique
  }
}
