import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'test@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'fj32ufsj',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface TokenDTO {
  access_token: string;
  refresh_token: string;
}

export class RegistrationDTO {
  @ApiProperty({
    example: 'antony_soprano',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  username: string;

  @ApiProperty({
    example: 'test@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'fj32ufsj',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
