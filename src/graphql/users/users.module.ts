import { Module } from '@nestjs/common';
import { UsersLoader } from './users.loader';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService, UsersLoader],
})
export class UsersModule {}
