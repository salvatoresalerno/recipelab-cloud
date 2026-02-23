import { IsEmail, IsString, MinLength, IsOptional, MaxLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Inserisci un indirizzo email valido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La password deve contenere almeno 8 caratteri' })
  @MaxLength(20, { message: 'La password non può superare i 20 caratteri' })
  // Opzionale: Regex per forzare almeno una maiuscola e un numero
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Lo username deve contenere almeno 3 caratteri' })
  @MaxLength(15, { message: 'Lo username non può superare i 15 caratteri' })
  username: string;
 
}