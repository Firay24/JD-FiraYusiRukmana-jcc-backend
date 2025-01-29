import { PaymentType } from '@prisma/client';

export class PaymentSaveDto {
  invoice?: string;
  date?: string;
  amount: number;
  status: PaymentType;
}
