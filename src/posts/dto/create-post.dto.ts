import { IsInt, IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @IsNotEmpty()
  userId: number; 

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
