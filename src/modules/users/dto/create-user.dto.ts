import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'O campo nome deve ser um nome válido.',
  })
  @IsNotEmpty({
    message: 'O campo nome é obrigatório.',
  })
  username: string;

  @IsEmail(
    {},
    { message: 'O campo email deve ser um endereço de email válido.' },
  )
  @IsNotEmpty({
    message: 'O campo email é obrigatório.',
  })
  email: string;

  @IsPhoneNumber('BR', {
    message: 'O campo telefone deve ser um número de telefone válido.',
  })
  @IsOptional()
  phone?: string;

  @IsStrongPassword(
    {},
    {
      message:
        'Senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
    },
  )
  password: string;
}
