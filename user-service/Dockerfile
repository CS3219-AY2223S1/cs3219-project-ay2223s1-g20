FROM registry.semaphoreci.com/golang:1.18 as builder

ENV APP_HOME /go/src/user_service
WORKDIR "$APP_HOME"
COPY . .

RUN go mod download
RUN go mod verify

RUN go build -o user_service cmd/main.go

FROM registry.semaphoreci.com/golang:1.18

ENV APP_HOME /go/src/user_service
RUN mkdir -p "$APP_HOME"
WORKDIR "$APP_HOME"

COPY --from=builder "$APP_HOME"/user_service $APP_HOME
COPY --from=builder "$APP_HOME"/.env.staging "$APP_HOME"/.env
EXPOSE 8000
CMD ["./user_service"]