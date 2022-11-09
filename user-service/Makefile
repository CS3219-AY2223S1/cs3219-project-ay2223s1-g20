APP_NAME := user_service

all: build

.PHONY: build
build:
	@if ! [ -d bin ]; then\
		mkdir bin;\
	fi
	cd cmd && go build -o ../bin/$(APP_NAME)

.PHONY: start
start:
	@if ! [ -d logs ]; then\
		mkdir logs;\
	fi
	@bin/$(APP_NAME) > logs/$(APP_NAME).log 2>&1

.PHONY: start-cache
start-cache:
	@if ! [ -d logs ]; then\
		mkdir logs;\
	fi
	@redis-server config/redis.conf > logs/cache.log 2>&1

.PHONY: run-test
run-test:
	go test -v ./...

.PHONY: test
test: start-cache run-test stop-cache
