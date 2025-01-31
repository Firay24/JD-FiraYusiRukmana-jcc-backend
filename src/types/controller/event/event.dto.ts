import { StageType } from '@prisma/client';

export class EventSaveDto {
  id?: string;
  name: string;
  description: string;
  stage: StageType;
  date: string;
  level: number;
  price: number;
  regionId: string;
  location: string;
  seasonId: string;
  subjectId: string;
  codePackage?: string;
  pathAnswer?: string;
}
