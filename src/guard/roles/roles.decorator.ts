import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';

export const Roles = Reflector.createDecorator<(Role.SUPERADMIN | Role.ADMIN | Role.EVENTADMIN | Role.PARTISIPANT | Role.FACILITATOR)[]>();
