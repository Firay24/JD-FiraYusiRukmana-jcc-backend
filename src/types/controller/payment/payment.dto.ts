import { PaymentType } from '@prisma/client';

export class PaymentSaveDto {
  invoice?: string;
  date?: number;
  amount: number;
  status: PaymentType;
}
