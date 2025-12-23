import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    { message: 'O campo email deve ser um endereço de email válido.' },
  )
  @IsNotEmpty({
    message: 'O campo email é obrigatório.',
  })
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'Senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
    },
  )
  password: string;
}
