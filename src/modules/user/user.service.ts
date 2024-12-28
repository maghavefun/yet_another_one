import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import { UserCreatingDTO } from './user.dtos';
import { User, UserWithUserPassword } from './user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly knexService: KnexService) {}

  async createOne(userDTO: UserCreatingDTO): Promise<User> {
    const knex = this.knexService.getKnex();

    try {
      this.logger.log(
        `Trying to create user with dto: ${JSON.stringify(userDTO)}`,
      );

      return await knex.transaction(async (trx) => {
        const [createdUser] = await trx('users')
          .insert({
            username: userDTO.username,
            email: userDTO.email,
          })
          .returning('*');

        await trx('user_passwords').insert({
          user_id: createdUser.id,
          password_hash: userDTO.pass_hash,
        });

        return createdUser;
      });
    } catch (error) {
      this.logger.error(`Error occured when creating user: ${error}`);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOneByEmail(email: string): Promise<UserWithUserPassword> {
    const knex = this.knexService.getKnex();

    try {
      const foundUser = await knex('users')
        .join('user_passwords', 'users.id', '=', 'user_passwords.user_id')
        .select(
          'users.id',
          'users.email',
          'users.username',
          'user_passwords.password_hash',
        )
        .where('users.email', email)
        .first();
      return foundUser;
    } catch (err) {
      throw err;
    }
  }
}
