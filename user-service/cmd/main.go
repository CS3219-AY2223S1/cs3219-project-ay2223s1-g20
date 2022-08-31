package main

import (
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/account"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cache"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cfg"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/db"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/jwt"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/logs"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		logs.WithError(err).Panicln("failed to load .env file")
	}
	env := cfg.ToEnv(os.Getenv("ENV"))
	setupLogging(env)

	connectToDB(env)
	defer db.Close()

	cacheAddress := os.Getenv("CACHE_ADDRESS")
	cache.Connect(cacheAddress)
	defer cache.Close()

	jwtKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	jwt.Init(jwtKey)

	port := os.Getenv("PORT")

	r := mux.NewRouter()
	r.HandleFunc("/accounts", account.RegisterHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/accounts/{username}", account.GetHandler).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/accounts/{username}", account.UpdateHandler).Methods(http.MethodPut, http.MethodOptions)
	r.HandleFunc("/accounts/{username}", account.DeleteHandler).Methods(http.MethodDelete, http.MethodOptions)

	r.HandleFunc("/login", account.LoginHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/logout", account.LogoutHandler).Methods(http.MethodPost, http.MethodOptions)
	log.WithFields(log.Fields{"port": port}).Infof("service starting")

	err := http.ListenAndServe(":"+port, r)
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

func connectToDB(env cfg.DeploymentEnvironment) {
	db_uri := os.Getenv("DB_URI")

	if err := db.Connect(db_uri); err != nil {
		logs.WithError(err).WithFields(log.Fields{"db_uri": db_uri}).Panicln("failed to connect to database")
	}
}
