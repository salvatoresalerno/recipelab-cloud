import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateCategorieDto {

    @IsString({message: '$property deve essere una stringa'})
    @IsNotEmpty({message: '$property non può essere vuoto'})
    @MinLength(3, { message: '$property deve essere da 3 a 50 caratteri' })
    @MaxLength(50, {message: '$property è max 50 caratteri'})
    categoria: string;


    @IsOptional()
    @MaxLength(150)
    @Matches(/^[a-zA-Z0-9_\-]+?\.(jpg|jpeg|png|webp|avif)$/i, {
        message: 'Il nome - formato immagine non valido.',
    })
    image?: string | null;  
}