package account

import (
	"encoding/json"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cache"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/http_response"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/jwt"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/logs"
	"github.com/gorilla/mux"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Credentials `json:",inline"`
}

type RegisterResponse struct {
	JWT string `json:"jwt"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if accountExists(req.Username) {
		http_response.WriteError(w, ErrDuplicateUsername, http.StatusConflict)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token, err := jwt.New(req.Username, expirationTime)
	if err != nil {
		handleServerError(w, err, "failed to create JWT", log.Fields{
			"username":       req.Username,
			"expirationTime": expirationTime,
		})
		return
	}

	if err := createAccount(req.Credentials); err != nil {
		handleServerError(w, err, "failed to create account", log.Fields{
			"username": req.Username,
		})
		return
	}

	http_response.WriteSuccess(w, RegisterResponse{JWT: token}, http.StatusCreated)
}

type LoginRequest struct {
	Credentials `json:",inline"`
}

type LoginResponse struct {
	JWT string `json:"jwt"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if !accountExists(req.Username) {
		http_response.WriteError(w, ErrUnknownUsername, http.StatusNotFound)
		return
	}

	account, _ := getAccount(req.Username)

	if !ComparePasswordHash(req.Password, account.PasswordHS) {
		http_response.WriteError(w, ErrIncorrectPassword, http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token, err := jwt.New(req.Username, expirationTime)
	if err != nil {
		handleServerError(w, err, "failed to create JWT", log.Fields{
			"username":       req.Username,
			"expirationTime": expirationTime,
		})
		return
	}

	http_response.WriteSuccess(w, LoginResponse{JWT: token}, http.StatusOK)
}

type LogoutRequest struct {
	JWT string `json:"jwt"`
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	var req LogoutRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if ok, err := jwt.VerifyAndParse(req.JWT, &jwt.Claims{}); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	} else if !ok {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := cache.Set(req.JWT, 0, 24*time.Hour); err != nil {
		handleServerError(w, err, "failed to blacklist JWT", log.Fields{"jwt": req.JWT})
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

type GetRequest struct {
	JWT string `json:"jwt"`
}

type GetResponse struct {
	Username string `json:"username"`
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req GetRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	account, err := getAccount(username)
	if err != nil {
		http_response.WriteError(w, ErrUnknownUsername, http.StatusNotFound)
		return
	}

	http_response.WriteSuccess(w, GetResponse{Username: account.Username}, http.StatusOK)
}

type UpdatePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
	JWT         string `json:"jwt"`
}

func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req UpdatePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := updatePassword(username, req.OldPassword, req.NewPassword); err != nil {
		switch err {
		case ErrUnknownUsername:
			http_response.WriteError(w, err, http.StatusNotFound)
		case ErrIncorrectPassword:
			http_response.WriteError(w, err, http.StatusBadRequest)
		default:
			handleServerError(w, err, "failed to update account", log.Fields{
				"username": username,
			})
		}
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

type DeleteRequest struct {
	JWT string `json:"jwt"`
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req DeleteRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, ErrInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := deleteAccount(username); err != nil {
		if err == ErrUnknownUsername {
			http_response.WriteError(w, err, http.StatusNotFound)
			return
		}
		handleServerError(w, err, "failed to delete account", log.Fields{
			"username": username,
		})
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

func handleServerError(w http.ResponseWriter, err error, message string, fields log.Fields) {
	logs.WithError(err).WithFields(fields).Warn(message)
	http_response.WriteError(w, err, http.StatusInternalServerError)
}
