APP_NAME=user_service

all: build

.PHONY: build
build:
	cd cmd && go build -o ../bin/$(APP_NAME)

.PHONY: start
start:
	nohup bin/user_service > logs/user_service.log 2>&1 & echo "$$!" > bin/service.pid

.PHONY: stop
stop:
	kill -9 `cat bin/service.pid` && rm bin/service.pid

.PHONY: start-cache
start-cache:
	nohup redis-server config/redis.conf > logs/cache.log 2>&1 & echo "$$!" > bin/cache.pid

.PHONY: stop-cache
stop-cache:
	kill -9 `cat bin/cache.pid` && rm bin/cache.pid
