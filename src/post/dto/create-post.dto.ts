import { IsArray, IsOptional, IsString } from "class-validator";

export interface OutputBlockData {
  id?: string;
  type: any;
  data: any;
  image?: any;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: OutputBlockData[];

  @IsOptional()
  @IsArray()
  tags: string;

  @IsOptional()
  @IsString()
  image: string;
}
