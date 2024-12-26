import {
	Injectable,
	Logger,
	BadRequestException,
	NotFoundException,
	HttpException,
	InternalServerErrorException,
} from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import { ArticleCreatingDTO, ArticleUpdatingDTO } from './article.dtos';
import { Article } from './article.interface';

@Injectable()
export class ArticleService {
	private readonly logger = new Logger(ArticleService.name);
	constructor(private readonly knexService: KnexService) {}

	async createOne(articleDTO: ArticleCreatingDTO): Promise<Article | Error> {
		const knex = this.knexService.getKnex();

		try {
			this.logger.log(
				this.createOne.name,
				`Creating article: ${JSON.stringify(articleDTO)}`,
			);
			const [createdArticle] = await knex('articles')
				.insert(articleDTO)
				.returning('*');

			return createdArticle;
		} catch (error) {
			this.logger.error(
				this.createOne.name,
				`Error occured when creating article. Error: ${JSON.stringify(error)}`,
			);
			throw new Error(`Error when creating article: ${error.message}`);
		}
	}

	async updateOneById(
		articleId: number,
		articleDTO: ArticleUpdatingDTO,
	): Promise<Article | HttpException> {
		const knex = this.knexService.getKnex();

		const articleFieldsToUpdate = Object.entries(articleDTO).reduce(
			(acc, [key, value]) => {
				if (value !== undefined) {
					acc[key] = value;
				}
				return acc;
			},
			{},
		);

		if (Object.keys(articleFieldsToUpdate).length === 0) {
			this.logger.error('Error when updating article. DTO is empty');
			throw new BadRequestException('Article DTO cannot be empty');
		}

		try {
			this.logger.log(
				`Updating article with id: ${articleId}. DTO: ${JSON.stringify(articleDTO)}`,
			);
			const [updatedArticle] = await knex('articles')
				.where({ id: articleId })
				.update(articleFieldsToUpdate)
				.returning('*');

			if (!updatedArticle) {
				this.logger.error(
					`Article with id: ${articleId} for updating not found`,
				);
				throw new NotFoundException(`Article with id: ${articleId} not found`);
			}

			return updatedArticle;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new InternalServerErrorException(`Something went wrong. Error: ${error.message}`);
		}
	}

	async deleteOneById(articleId: number): Promise<void | HttpException> {
		const knex = this.knexService.getKnex();

		try {
			const [deletedArticle] = await knex('articles')
				.where({id: articleId})
				.del()
				.returning('id')

			if(!deletedArticle) {
				throw new NotFoundException(`Article with id: ${articleId} not found`)
			}
		} catch(error) {
			if(error instanceof HttpException) {
				throw error
			}
			throw new  InternalServerErrorException(`Something went wrong. Error: ${error.message}`)
		}
	}
}
