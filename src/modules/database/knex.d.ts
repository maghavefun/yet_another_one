import { Article } from '../article/article.interface';
import { User, UserPassword } from '../user/user.interface';

declare module 'knex/types/tables' {
  interface Tables {
    articles: Article;
    users: User;
    user_passwords: UserPassword;
  }
}
