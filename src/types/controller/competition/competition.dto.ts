export class CompetitionSaveDto {
  id?: string;
  studentId: string;
  competitionId: string;
  competitionRommId?: string;
  paymentId?: string;
  attedance: boolean;
  score?: number;
  correct?: number;
  incorrect?: number;
  pathAnswer?: string;
}
