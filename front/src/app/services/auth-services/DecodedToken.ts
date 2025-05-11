import { JwtPayload } from 'jwt-decode';

export interface DecodedToken extends JwtPayload {
  permissions: string[];
  role: string;
  username: string;
  sub: string;
}
