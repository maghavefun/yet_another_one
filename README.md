## Clone the project

```bash
git clone https://github.com/maghavefun/pg_rest_test
```

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
