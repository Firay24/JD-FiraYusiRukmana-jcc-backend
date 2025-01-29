import { StageType } from '@prisma/client';

export class StudentSaveDto {
  id?: string;
  address: string;
  stage: StageType;
  class: string;
  nik: string;
  schoolId: string;
  fatherName: string;
  motherName: string;
  idUser: string;
  photoPath?: string;
  poin?: number;
}
