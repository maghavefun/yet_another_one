import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  Body,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiParam,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  ArticleCreatingDTO,
  ArticleUpdatingDTO,
  ArticleQueryOptions,
} from './article.dtos';
import { Article } from './article.interface';
import { PageDTO } from '../../common/DTO/page.dtos';

@Controller('article')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(private readonly articleService: ArticleService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({ description: 'The article successfully created' })
  @ApiBadRequestResponse({
    description: 'Incorrect data format for artice creation',
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: ArticleCreatingDTO,
    description: 'Article data as JSON format for creating',
  })
  async createArticle(
    @Body() articleCreatingDTO: ArticleCreatingDTO,
  ): Promise<Article | HttpException> {
    this.logger.log('Handling POST request /article');
    return await this.articleService.createOne(articleCreatingDTO);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put(':articleId')
  @ApiOkResponse({ description: 'Article updated by id successfully' })
  @ApiBadRequestResponse({
    description: 'Incorrect data format for artice updating',
  })
  @ApiNotFoundResponse({ description: 'Article with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Unautorized user' })
  @ApiBody({
    type: ArticleUpdatingDTO,
    description: 'Article data as JSON for updating by id',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article id as an integer',
    required: true,
  })
  async updateArticleById(
    @Param('articleId') articleId: string,
    @Body() articleUpdatingDTO: ArticleUpdatingDTO,
  ): Promise<Article | HttpException> {
    this.logger.log(`Handling PUT request /article/${articleId}`);
    return await this.articleService.updateOneById(
      Number(articleId),
      articleUpdatingDTO,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':articleId')
  @ApiNoContentResponse({
    description: 'Article with provided id successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Article with provided id not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized user',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article id as an integer',
    required: true,
  })
  async deleteArticleById(
    @Param('articleId') articleId: string,
  ): Promise<void | HttpException> {
    this.logger.log(`Handling DELETE request /article/${articleId}`);
    return await this.articleService.deleteOneById(Number(articleId));
  }

  @HttpCode(HttpStatus.OK)
  @Get(':articleId')
  @ApiOkResponse({
    description: 'Article with provided id successfully found',
  })
  @ApiNotFoundResponse({
    description: 'Article with provided id not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
  })
  @ApiUnauthorizedResponse({
    description: 'Unathorized user',
  })
  @ApiParam({
    name: 'articleId',
    description: 'Article id as an integer',
    required: true,
  })
  async getArticleById(@Param('articleId') articleId: string) {
    this.logger.log(`Handling GET request /article/${articleId}`);
    return await this.articleService.findOneById(Number(articleId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({ description: 'Articles successfully found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized response' })
  async getArticles(
    @Query() articleQueryOptions: ArticleQueryOptions,
  ): Promise<PageDTO<Article> | HttpException> {
    this.logger.log(
      `Handling GET request /article/${JSON.stringify(articleQueryOptions)}`,
    );

    const { tags } = articleQueryOptions;
    if (tags && tags.length > 0) {
      return await this.articleService.findArticlesByTags(articleQueryOptions);
    }
    return await this.articleService.findArticles(articleQueryOptions);
  }
}
