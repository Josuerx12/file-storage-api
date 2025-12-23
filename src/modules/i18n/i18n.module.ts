import { Module } from '@nestjs/common';
import * as path from 'path';
import {
  I18nModule,
  AcceptLanguageResolver,
  I18nJsonLoader,
} from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '../../infra/i18n/'),
        watch: true,
      },
      resolvers: [
        {
          use: AcceptLanguageResolver,
          options: ['accept-language'],
        },
      ],
    }),
  ],
  exports: [I18nModule],
})
export class I18nNestModule {}
