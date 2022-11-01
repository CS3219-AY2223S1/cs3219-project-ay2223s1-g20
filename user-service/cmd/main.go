package main

import (
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
	log "github.com/sirupsen/logrus"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/account"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cache"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cfg"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/db"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/jwt"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/logs"
)

func main() {
	envString, ok := os.LookupEnv("ENV")
	if !ok {
		if err := godotenv.Load(".env"); err != nil {
			logs.WithError(err).Panicln("failed to load .env file")
		}
	}

	env := cfg.ToEnv(envString)
	setupLogging(env)

	connectToDB()
	defer db.Close()

	connectToCache()
	defer cache.Close()

	jwtKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	jwt.SetKey(jwtKey)

	port := os.Getenv("PORT")

	router := account.NewRouter()
	corsRouter := configureCORS().Handler(router)

	log.WithFields(log.Fields{"port": port}).Infof("service starting")
	err := http.ListenAndServe(":"+port, corsRouter)
	logs.WithError(err).Panic("service crashed")
}

func setupLogging(env cfg.DeploymentEnvironment) {
	switch env {
	case cfg.DEV:
		log.SetFormatter(&log.TextFormatter{
			DisableColors: false,
		})
		log.SetLevel(log.InfoLevel)
	case cfg.STAG, cfg.PROD:
		log.SetFormatter(&log.JSONFormatter{})
		log.SetLevel(log.WarnLevel)
	default:
		log.SetFormatter(&log.JSONFormatter{})
		log.SetLevel(log.WarnLevel)
	}
}

func connectToDB() {
	db_uri := os.Getenv("DB_URI")
	db_name := os.Getenv("DB_NAME")

	if err := db.Connect(db_uri, db_name); err != nil {
		logs.WithError(err).WithFields(log.Fields{"db_uri": db_uri}).Panicln("failed to connect to database")
	}
}

func connectToCache() {
	cacheAddress := os.Getenv("CACHE_ADDRESS")
	if err := cache.Connect(cacheAddress); err != nil {
		logs.WithError(err).WithFields(log.Fields{"cache_uri": cacheAddress}).Panicln("failed to connect to cache")
	}
}

func configureCORS() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowedHeaders:   []string{"Accept", "Accept-Language", "Content-Type"},
	})
}
