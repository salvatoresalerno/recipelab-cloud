import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Inserisci un indirizzo email valido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La password deve contenere almeno 8 caratteri' })
  @MaxLength(20, { message: 'La password non può superare i 20 caratteri' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero',
  })
  password: string;
}