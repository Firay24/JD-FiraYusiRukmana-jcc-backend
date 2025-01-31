import { StageType, StatusSchool, Subdistrict } from '@prisma/client';

export class SchoolSaveDto {
  id?: string;
  name: string;
  stage: StageType;
  subdistrict: Subdistrict;
  status: StatusSchool;
  ward: string;
}
