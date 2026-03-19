import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateTagDto {

    @IsString({message: '$property deve essere una stringa'})
    @IsNotEmpty({message: '$property non può essere vuoto'})
    @MaxLength(50, {message: '$property è max 50 caratteri'})
    tag: string;

    @IsString({message: '$property deve essere una stringa'})
    @IsNotEmpty({message: '$property non può essere vuoto'})
    @MaxLength(50, {message: '$property è max 50 caratteri'})
    @Matches(/^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6})$/, {
        message: 'Formato colore non valido (es. #FFF o #FFFFFF)'
    })
    color: string;

}