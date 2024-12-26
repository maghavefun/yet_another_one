import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../constants/common';
import { Type } from 'class-transformer';

export class PageMetaDTO {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDTO, itemCount }: PageMetaDTOParams) {
    this.page = pageOptionsDTO.page;
    this.limit = pageOptionsDTO.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDTO<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDTO })
  readonly meta: PageMetaDTO;

  constructor(data: T[], meta: PageMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}

export interface PageMetaDTOParams {
  pageOptionsDTO: PageOptionsDTO;
  itemCount: number;
}

export class PageOptionsDTO {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 40,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  @IsOptional()
  readonly limit?: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
