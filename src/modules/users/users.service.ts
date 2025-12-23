import 'dotenv/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbstractService } from 'src/utils/abstract.service';
import { User } from './entities/user.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { UserAuth } from './entities/user-auth.entity';
import { LoginDto } from './dto/login.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(UsersService.name, userRepository);
  }

  protected async beforeCreate(
    data: DeepPartial<User & CreateUserDto>,
  ): Promise<void> {
    const emailExists = await this.userRepository.findOne({
      where: { email: data.email! },
      select: ['id'],
    });

    if (emailExists) {
      throw new ConflictException('Email já está em uso.');
    }

    const user = User.create({
      username: data.username!,
      email: data.email!,
      phone: data.phone,
    });

    data = user;
  }

  protected async afterCreate(data: User & CreateUserDto): Promise<void> {
    const hashedPassword = await hash(data.password!, 10);

    const userAuth = UserAuth.create({
      user: {
        id: data.id!,
      },
      password: hashedPassword,
    });

    userAuth.save();
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'phone', 'username', 'status', 'auth'],
      relations: ['auth'],
    });

    if (!user) {
      throw new ConflictException('Credenciais inválidas.');
    }

    const isValid = await compare(data.password, user.auth.password);

    if (!isValid) {
      throw new ConflictException('Credenciais inválidas.');
    }

    const token = sign(user.id, process.env.JWT_SECRET || 'default');

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
      },
      token,
    };
  }
}
