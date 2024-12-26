import {
	Controller,
	Post,
	Put,
	Delete,
	Param,
	HttpCode,
	HttpStatus,
	Logger,
	Body,
	UseInterceptors,
	ClassSerializerInterceptor,
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
import { ArticleCreatingDTO, ArticleUpdatingDTO } from './article.dtos';

@Controller('article')
export class ArticleController {
	private readonly logger = new Logger(ArticleController.name);
	constructor(private readonly articleService: ArticleService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@ApiCreatedResponse({ description: 'The article successfully created' })
	@ApiBadRequestResponse({description: 'Incorrect data format for artice creation'})
	@ApiInternalServerErrorResponse({ description: 'Something went wrong' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized user' })
	@ApiBody({
		type: ArticleCreatingDTO,
		description: 'Article data as JSON format for creating',
	})
	async createArticle(@Body() articleCreatingDTO: ArticleCreatingDTO) {
		this.logger.log('Handling POST request /article');
		return await this.articleService.createOne(articleCreatingDTO);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@HttpCode(HttpStatus.OK)
	@Put(':articleId')
	@ApiOkResponse({ description: 'Article updated by id successfully' })
	@ApiBadRequestResponse({description: 'Incorrect data format for artice updating'})
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
	) {
		this.logger.log('Handling PUT request /article');
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
	async deleteArticleById(@Param('articleId') articleId: string) {
		this.logger.log('Handling DELETE request /article');
		return await this.articleService.deleteOneById(Number(articleId));
	}
}
