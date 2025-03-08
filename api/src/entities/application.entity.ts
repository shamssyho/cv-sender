// application.entity.ts (si vous utilisez TypeORM)
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: string; // ex: "LinkedIn", "Indeed", ...

  @Column()
  jobTitle: string; // intitulé du poste ou référence

  @Column()
  status: string; // "success" ou "error"

  @Column({ type: 'timestamptz' })
  appliedAt: Date; // date/heure d'envoi de la candidature
}
