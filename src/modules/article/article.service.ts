import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import {
  ArticleCreatingDTO,
  ArticleUpdatingDTO,
  ArticleQueryOptions,
} from './article.dtos';
import { Article } from './article.interface';
import { PageDTO, PageMetaDTO } from '../../common/DTO/page.dtos';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(private readonly knexService: KnexService) {}

  async createOne(
    articleDTO: ArticleCreatingDTO,
  ): Promise<Article | HttpException> {
    const knex = this.knexService.getKnex();

    try {
      this.logger.log(
        this.createOne.name,
        `Creating article: ${JSON.stringify(articleDTO)}`,
      );
      const [createdArticle] = await knex('articles')
        .insert(articleDTO)
        .returning('*');

      this.logger.log(
        `Article successfully created: ${JSON.stringify(createdArticle)}`,
      );

      return createdArticle;
    } catch (error) {
      this.logger.error(
        this.createOne.name,
        `Error occured when creating article. Error: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(`Error when creating article`);
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
        throw new NotFoundException(`Article with id: ${articleId} not found`);
      }

      this.logger.log(
        `Article with id: ${articleId} updated: ${JSON.stringify(updatedArticle)}`,
      );

      return updatedArticle;
    } catch (error) {
      this.logger.error(
        this.updateOneById.name,
        `Error occured when updating article. ${JSON.stringify(error)}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async deleteOneById(articleId: number): Promise<void | HttpException> {
    const knex = this.knexService.getKnex();

    try {
      this.logger.log(`Deleting article with id: ${articleId}`);
      const [deletedArticle] = await knex('articles')
        .where({ id: articleId })
        .del()
        .returning('id');

      if (!deletedArticle) {
        throw new NotFoundException(`Article with id: ${articleId} not found`);
      }

      this.logger.log(
        `Article with id: ${articleId} successfully deleted. Deleted article: ${deletedArticle}`,
      );
    } catch (error) {
      this.logger.error(
        this.deleteOneById.name,
        `Error occured when deleting article. ${JSON.stringify(error)}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Something went wrong. Error: ${error.message}`,
      );
    }
  }

  async findOneById(articleId: number): Promise<Article | HttpException> {
    const knex = this.knexService.getKnex();

    try {
      this.logger.log(`Finding article by id: ${articleId}`);

      const foundArticle = await knex('articles')
        .where({ id: articleId })
        .first();

      if (!foundArticle) {
        throw new NotFoundException(`Article with id: ${articleId} not found`);
      }

      this.logger.log(
        `Article found by id: ${articleId}. article: ${JSON.stringify(foundArticle)}`,
      );

      return foundArticle;
    } catch (error) {
      this.logger.error(
        this.findOneById.name,
        `Error occured when finding article by id. ${JSON.stringify(error)}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Something went wrong. Error: ${error.message}`,
      );
    }
  }

  async findArticles(
    articleQueryOptions: ArticleQueryOptions,
  ): Promise<PageDTO<Article> | HttpException> {
    const knex = this.knexService.getKnex();
    const { limit, offset, order } = articleQueryOptions;

    try {
      this.logger.log(
        this.findArticles.name,
        `Trying to get articles with pagination`,
      );
      const foundArticles = await knex.transaction(async (trx) => {
        const articles = await trx('articles')
          .select('*')
          .orderBy('title', order)
          .limit(limit)
          .offset(offset);

        const [{ count: totalItems }] = await trx('articles').count();
        const pageMeta = new PageMetaDTO({
          pageOptionsDTO: articleQueryOptions,
          itemCount: parseInt(String(totalItems), 10),
        });

        return new PageDTO(articles, pageMeta);
      });

      this.logger.log(
        this.findArticles.name,
        `Articles for query: ${JSON.stringify(articleQueryOptions)} found.`,
      );

      return foundArticles;
    } catch (error) {
      this.logger.error(
        this.findArticles.name,
        `Error occured when trying to find articles with query. Error: ${error}`,
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findArticlesByTags(
    articleQueryOptions: ArticleQueryOptions,
  ): Promise<PageDTO<Article> | HttpException> {
    const knex = this.knexService.getKnex();
    const { tags, limit, offset, order } = articleQueryOptions;

    try {
      this.logger.log(
        this.findArticlesByTags.name,
        `Finding articles by tags: ${tags}`,
      );

      const foundArticles = await knex.transaction(async (trx) => {
        const articles = await trx('articles')
          .select('*')
          .orderBy('title', order)
          .limit(limit)
          .offset(offset)
          .whereRaw('tags @> ?::jsonb', [JSON.stringify(tags)]);

        const [{ count: totalItems }] = await trx('articles')
          .count()
          .modify((qb) => {
            qb.whereRaw('tags @> ?::jsonb', [JSON.stringify(tags)]);
          });

        const pageMeta = new PageMetaDTO({
          pageOptionsDTO: articleQueryOptions,
          itemCount: parseInt(String(totalItems), 10),
        });

        return new PageDTO(articles, pageMeta);
      });

      return foundArticles;
    } catch (error) {
      this.logger.error(
        `Error occured when finding articles by tags: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
