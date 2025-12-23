import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/infra/db/typeorm.config';
import { User } from '../users/entities/user.entity';
import { UserAuth } from '../users/entities/user-auth.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig.getConfig()),
    TypeOrmModule.forFeature([User, UserAuth]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
