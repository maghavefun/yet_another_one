import { Article } from '../article.interface';

declare module 'knex/types/tables' {
  interface Tables {
    articles: Article;
  }
}
