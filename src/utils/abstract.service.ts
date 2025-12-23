import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export type BasicEntity = {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} & ObjectLiteral;

@Injectable()
export abstract class AbstractService<T extends BasicEntity> {
  protected readonly logger: Logger;

  constructor(
    protected readonly context: string,
    protected readonly repository: Repository<T>,
  ) {
    this.logger = new Logger(context);
  }

  protected beforeCreate?(data: DeepPartial<T>): Promise<void>;
  protected afterCreate?(data: T): Promise<void>;

  protected beforeUpdate?(data: DeepPartial<T>): Promise<void>;
  protected afterUpdate?(data: T): Promise<void>;

  protected beforeDelete?(data: DeepPartial<T>): Promise<void>;
  protected afterDelete?(data: T): Promise<void>;

  async create(payload: DeepPartial<T>): Promise<T> {
    try {
      await this.beforeCreate?.(payload);

      const dataSaved = await this.repository.save(payload);

      await this.afterCreate?.(dataSaved);

      return dataSaved;
    } catch (error) {
      this.logger.error(`create:${error.message}`);
      throw error;
    }
  }

  async update(id: string | number, payload: DeepPartial<T>): Promise<T> {
    try {
      await this.get(id);

      payload.id = id;

      await this.beforeUpdate?.(payload);

      const dataSaved = await this.repository.save(payload);

      await this.afterUpdate?.(dataSaved);

      return dataSaved;
    } catch (error) {
      this.logger.error(`update:${error.message}`);
      throw error;
    }
  }

  async delete(payload: DeepPartial<T>): Promise<void> {
    try {
      const data = await this.get(payload.id!);

      const mergedData = { ...data, ...payload };

      await this.beforeDelete?.(mergedData);

      await this.repository.softDelete({
        id: payload.id,
      } as FindOptionsWhere<T>);

      await this.afterDelete?.(data);
    } catch (error) {
      this.logger.error(`delete:${error.message}`);
      throw error;
    }
  }

  async get(id: string | number, options?: FindOneOptions<T>): Promise<T> {
    try {
      const data = await this.repository.findOne({
        ...options,
        where: {
          id,
          ...(options?.where || {}),
        } as FindOptionsWhere<T>,
      });

      if (!data) {
        throw new NotFoundException('Valor não encontrado');
      }

      return data;
    } catch (error) {
      this.logger.error(`get:${error.message}`);
      throw error;
    }
  }

  async list({
    query,
    config,
  }: {
    query: PaginateQuery;
    config: PaginateConfig<T>;
  }): Promise<Paginated<T>> {
    try {
      return await paginate(query, this.repository, config);
    } catch (error) {
      this.logger.error(`list:${error.message}`);
      throw error;
    }
  }
}
