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
	@if ! [ -f bin/$(APP_NAME).pid ]; then\
		nohup bin/$(APP_NAME) > logs/$(APP_NAME).log 2>&1 & echo "$$!" > bin/$(APP_NAME).pid;\
	else\
		echo "App already running at PID:";\
		cat bin/$(APP_NAME).pid;\
	fi

.PHONY: stop
stop:
	@if [ -f bin/$(APP_NAME).pid ]; then\
		kill -9 `cat bin/$(APP_NAME).pid` && rm bin/$(APP_NAME).pid;\
	else\
		echo "App not currently running";\
	fi

.PHONY: start-cache
start-cache:
	@if ! [ -d logs ]; then\
		mkdir logs;\
	fi
	@if ! [ -f bin/cache.pid ]; then\
		nohup redis-server config/redis.conf > logs/cache.log 2>&1 & echo "$$!" > bin/cache.pid;\
	else\
		echo "Cache already running at PID:";\
		cat bin/cache.pid;\
	fi

.PHONY: stop-cache
stop-cache:
	@if [ -f bin/cache.pid ]; then\
		kill -9 `cat bin/cache.pid` && rm bin/cache.pid;\
	else\
		echo "Cache not currently running";\
	fi

.PHONY: run-test
run-test:
	go test -v ./...

.PHONY: test
test: start-cache run-test stop-cache
