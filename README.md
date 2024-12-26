## Clone the project

```bash
git clone https://github.com/maghavefun/yet_another_one.git
```

# How to start the project

## Local installation of project(not recommended)

```bash
npm ci
```

Before starting the project locally or in docker locally, make shure there is a .env file with environment variables. Example of content in .example.env

## Starting the project in local environment(not recommended)

```bash
# development
npm run start
```

```bash
#watch mode
npm run start:dev
```

```bash
# production mode
npm run start:prod
```

## Swagger docs

API documentation for dev env is available by [link](http://localhost:4000/api-docs#/)

## Starting project with docker locally

To install docker use this guide[LINK](https://docs.docker.com/engine/install/)

If you added new dependencies to the project start it with rebuilding container(use --build flag). In other cases flag can be skipped.

```bash
docker compose build --no-cache

docker compose up --watch
```

Stop the project in docker containers with removing specified volumes in docker-compose.yml

```bash
docker compose down -v
```

Restart the containers

```bash
docker compose restart
```

## How to work with Migrations and Seeds

## Migrations

So you need to implement new feature and for this you should change a table schema or create new table.

First you need to create migration script file by using:

```bash
npm run migration:make your_migration_script_name
```

Command above will create something like this in migrations folder:

```bash
migrations/20241225123457_your_migration_script_name.js
```

Then you should determine the schema for your new table or existing table:

```javascript
exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // Автоинкрементный первичный ключ
        table.string('name').notNullable(); // Имя пользователя
        table.string('email').unique().notNullable(); // Email
        table.timestamps(true, true); // Временные метки created_at и updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users'); // Удаление таблицы
};
```

Next step is to apply the migrations. So use the next command:

```bash
npm run migration:latest
```

You can also rollback migration in case of errors:

```bash
npm run migration:rollback
```

There is also script for prestart in prod environment and it simply uses npm run migration:latest :

```bash
npm run prestart:prod
```

## Seeds

Commands seed:make and seed:run is used to fullfill tables with initial data. It's useful when developing, testing and production initialization.

seed:make can be used to create new file with data, that will be append to table

```bash
npm run seed:make name_of_seed
```

seed:run executes seed files, and appends data to table

```bash
npm run seed:run
```

## How to commit properly with conventional commits

When commiting with git commit make shure your message matches the conventional commits
template. You can check the specification here: [LINK](https://www.conventionalcommits.org/en/v1.0.0/)

TLDR
use:
To fix branches

```bash
git commit -m "fix: I did the fix"
```

For feature branches:

```bash
git commit -m "feat: I made the feature, wow"
```

For breaking changes use BREAKING CHANGE footer, or append ! after message scope

```bash
git commit -m "feat!: some feature with breaking changes"

#or

git commit -m "BREAKING CHANGE: some breaking changes"
```

You can use git editor, that will be your default editor in system by using just git commit without -m flag and message

```bash
git commit
```
