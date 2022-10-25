# CS3219-AY22-23-Project-Skeleton

This is a template repository for CS3219 project.

## User Service

See the [README](user-service/README.md)

## Frontend
1. Install npm packages using `npm i`.
2. Run Frontend using `npm start`.

## Staging Environment

Follow the instructions below to deploy the app to the staging environment.

Prerequisites:
1. [Docker](https://www.docker.com/)
2. [Docker Compose](https://docs.docker.com/compose/install/)

Steps:
1. Go to the project root directory

2. Run the following command
```shell
docker compose up --build -d
```

3. Access the app at "http://localhost:3000