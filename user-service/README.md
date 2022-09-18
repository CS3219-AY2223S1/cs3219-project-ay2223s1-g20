# User Service

The user service is responsible for maintaining information and authentication of users of PeerPrep.

## API Specification

See the [documentation](docs/api.md)

## Setup Guide for Local Deployment

### Prerequisites

1. [Golang](https://go.dev/doc/install)
2. [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
3. [Redis](https://redis.io/docs/getting-started/installation/)
4. `make`

### Instructions

1. Go to the user service directory
```shell
cd user-service
```

2. Duplicate the `.env.dev` file and rename it to `.env`. Fill in the environment variables accordingly.

3. Start MongoDB with
``` shell
brew services start mongodb-community@6.0
```
 Verify that MongoDB is running with
```shell
brew services list
```
You should see a `mongodb-community` service with status `started` 

4. Start Redis cache with
```shell
make start-cache
```

5. Build the app with
```shell
make
```

6. Start the app with
```shell
make start
```

7. Stop the app and cache with 
```shell
make stop
make stop-cache
```

## Deployment to Staging Environment

### Prerequisites

1. [Docker](https://www.docker.com/get-started/)
2. [Docker Compose](https://docs.docker.com/compose/install/)

### Instructions

1. Go to the project root directory

2. Start the application with
```shell
docker-compose up -d
```
