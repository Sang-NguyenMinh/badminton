import { UserRole } from 'src/core/users/constants';

export interface AuthenticatedUser {
  // _id: string;
  role: UserRole;
}
