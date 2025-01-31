export class AuthDto {
  id?: string;
  username: string;
  password: string;
  name: string;
  email?: string | null;
  roleId?: string;
  birthdate?: number;
  phoneNumber?: string;
  gender?: boolean;
}
