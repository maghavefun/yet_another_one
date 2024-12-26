import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsJSON,
  Length,
} from 'class-validator';
import { ArticleVisibility, Article } from './article.interface';

export class ArticleCreatingDTO implements Article {
  @Exclude()
  id: number;

  @ApiProperty({
    example: 'How to use NestJS',
    description: 'The title of the article',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'NestJS is a framework ofr building efficient, reliable, and scalableserver-side applications',
    description: 'The content of the article',
    required: true,
  })
  @IsString()
  @Length(1, 2000)
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '["nestjs", "backend", "typescript"]',
    description: 'The tags associated with the article, stored in JSON format',
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsJSON()
  tags: string[] = [];

  @ApiProperty({
    example: 'public',
    description: 'Visibility of the article, either "public" or "internal"',
    required: true,
    enum: ArticleVisibility,
  })
  @IsEnum(ArticleVisibility)
  visibility: ArticleVisibility;

  @Exclude()
  created_at: string;

  @Exclude()
  updated_at: string;

  @Exclude()
  deleted: boolean;
}

export class ArticleUpdatingDTO implements Partial<Article> {
  @ApiProperty({
    example: 'How to use NestJS',
    description: 'The title of the article',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @ApiProperty({
    example:
      'NestJS is framework for building efficient, reliable, and scalable server-side applications',
    description: 'The content of the article',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 2000)
  content?: string;

  @ApiProperty({
    example: '["nestjs", "backend", "typescript"]',
    description: 'The tags associated with the article, stored in JSON format',
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsJSON()
  tags?: string[];

  @ApiProperty({
    example: 'public',
    description: 'Visibility of the article, either "public" or "internal"',
    required: false,
    enum: ArticleVisibility,
  })
  @IsOptional()
  @IsEnum(ArticleVisibility)
  visibility?: ArticleVisibility;

  @Exclude()
  created_at?: string;

  @Exclude()
  updated_at?: string;

  @Exclude()
  deleted?: boolean;
}
