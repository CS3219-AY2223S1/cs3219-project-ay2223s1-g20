package main

import (
	"log"
	"net/http"
	"os"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/account"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cfg"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/db"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		panic(err)
	}
	env := cfg.ToEnv(os.Getenv("ENV"))

	var db_uri string

	switch env {
	case cfg.DEV:
		db_uri = os.Getenv("DB_LOCAL_URI")
	case cfg.STAG, cfg.PROD:
		db_uri = os.Getenv("DB_CLOUD_URI")
	}

	if err := db.Connect(db_uri); err != nil {
		panic(err)
	}
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/account", account.RegisterHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/account/{username}", account.GetHandler).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/account/{username}", account.UpdateHandler).Methods(http.MethodPut, http.MethodOptions)
	r.HandleFunc("/account/{username}", account.DeleteHandler).Methods(http.MethodDelete, http.MethodOptions)
	log.Fatal(http.ListenAndServe(":8000", r))
}
