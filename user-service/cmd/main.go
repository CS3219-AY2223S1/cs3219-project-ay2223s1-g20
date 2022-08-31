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
	log.SetFormatter(&log.TextFormatter{
		DisableColors: false,
	})

	if err := godotenv.Load(".env"); err != nil {
		logs.WithError(err).Panicln("failed to load .env file")
	}
	env := cfg.ToEnv(os.Getenv("ENV"))

	logLevel := toLogLevel(env)
	log.SetLevel(logLevel)

	if err := connectToDB(env); err != nil {
		logs.WithError(err).Panicln("failed to connect to database")
	}
	defer db.Close()

	cache.Connect()
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

func toLogLevel(env cfg.DeploymentEnvironment) log.Level {
	switch env {
	case cfg.DEV:
		return log.DebugLevel
	case cfg.STAG, cfg.PROD:
		return log.WarnLevel
	default:
		return log.WarnLevel
	}
}

func connectToDB(env cfg.DeploymentEnvironment) error {
	var db_uri string

	switch env {
	case cfg.DEV:
		db_uri = os.Getenv("DB_LOCAL_URI")
	case cfg.STAG, cfg.PROD:
		db_uri = os.Getenv("DB_CLOUD_URI")
	}

	return db.Connect(db_uri)
}
