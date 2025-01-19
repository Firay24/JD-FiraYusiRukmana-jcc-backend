export class PayloadDto {
  id: string;
  username: string;
  role: {
    id: string;
    name: string;
  };
  iat?: number;
  exp?: number;
}
