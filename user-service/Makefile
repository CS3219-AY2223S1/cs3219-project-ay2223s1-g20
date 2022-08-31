APP_NAME=user_service

all: build

.PHONY: build
build:
	mkdir -p bin
	cd cmd && go build -o ../bin/$(APP_NAME)

.PHONY: start
start:
	mkdir -p logs
	nohup bin/$(APP_NAME) > logs/$(APP_NAME).log 2>&1 & echo "$$!" > bin/$(APP_NAME).pid

.PHONY: stop
stop:
	kill -9 `cat bin/$(APP_NAME).pid` && rm bin/$(APP_NAME).pid

.PHONY: start-cache
start-cache:
	mkdir -p logs
	nohup redis-server config/redis.conf > logs/cache.log 2>&1 & echo "$$!" > bin/cache.pid

.PHONY: stop-cache
stop-cache:
	kill -9 `cat bin/cache.pid` && rm bin/cache.pid
