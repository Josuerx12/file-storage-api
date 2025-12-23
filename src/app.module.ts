import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FtpService } from './modules/ftp/ftp.service';
import { DbModule } from './modules/db/db.module';
import { FtpModule } from './modules/ftp/ftp.module';
import { UsersModule } from './modules/users/users.module';
import { I18nNestModule } from './modules/i18n/i18n.module';

@Module({
  imports: [DbModule, FtpModule, UsersModule, I18nNestModule],
  controllers: [AppController],
  providers: [AppService, FtpService],
})
export class AppModule {}
