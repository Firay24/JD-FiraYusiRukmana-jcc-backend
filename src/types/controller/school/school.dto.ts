import { StageType, StatusSchool } from '@prisma/client';

export class SchoolSaveDto {
  id?: string;
  name: string;
  stage: StageType;
  subdistrict: string;
  status: StatusSchool;
  ward: string;
}
