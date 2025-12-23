import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export class TypeOrmConfig {
  getConfig(): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
      type: (process.env.DB_DIALECT as any) || 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'mydatabase',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      synchronize: false,
    };

    return config;
  }
}

export const typeOrmConfig = new TypeOrmConfig();

const dataSourceOptions = typeOrmConfig.getConfig() as DataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
