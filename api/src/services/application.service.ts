import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/entities/application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from 'src/dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  create(application: CreateApplicationDto) {
    const newApp = this.appRepo.create(application);
    return this.appRepo.save(newApp);
  }

  findAll() {
    return this.appRepo.find();
  }
}
