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

type credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type registerRequest struct {
	credentials `json:",inline"`
}

type registerResponse struct {
	JWT string `json:"jwt"`
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if accountExists(req.Username) {
		http_response.WriteError(w, errDuplicateUsername, http.StatusConflict)
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

	if err := createAccount(req.credentials); err != nil {
		handleServerError(w, err, "failed to create account", log.Fields{
			"username": req.Username,
		})
		return
	}

	http_response.WriteSuccess(w, registerResponse{JWT: token}, http.StatusCreated)
}

type loginRequest struct {
	credentials `json:",inline"`
}

type loginResponse struct {
	JWT string `json:"jwt"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if !accountExists(req.Username) {
		http_response.WriteError(w, errUnknownUsername, http.StatusNotFound)
		return
	}

	account, _ := getAccount(req.Username)

	if !comparePasswordHash(req.Password, account.PasswordHS) {
		http_response.WriteError(w, errIncorrectPassword, http.StatusUnauthorized)
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

	http_response.WriteSuccess(w, loginResponse{JWT: token}, http.StatusOK)
}

type logoutRequest struct {
	JWT string `json:"jwt"`
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	var req logoutRequest
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
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := cache.Set(req.JWT, 0, 24*time.Hour); err != nil {
		handleServerError(w, err, "failed to blacklist JWT", log.Fields{"jwt": req.JWT})
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

type getRequest struct {
	JWT string `json:"jwt"`
}

type getResponse struct {
	Username string `json:"username"`
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req getRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	account, err := getAccount(username)
	if err != nil {
		http_response.WriteError(w, errUnknownUsername, http.StatusNotFound)
		return
	}

	http_response.WriteSuccess(w, getResponse{Username: account.Username}, http.StatusOK)
}

type updatePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
	JWT         string `json:"jwt"`
}

func updateHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req updatePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := updatePassword(username, req.OldPassword, req.NewPassword); err != nil {
		switch err {
		case errUnknownUsername:
			http_response.WriteError(w, err, http.StatusNotFound)
		case errIncorrectPassword:
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

type deleteRequest struct {
	JWT string `json:"jwt"`
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam, http.StatusBadRequest)
		return
	}

	var req deleteRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	claims := &jwt.Claims{}
	if ok, err := jwt.VerifyAndParse(req.JWT, claims); err != nil {
		handleServerError(w, err, "failed to parse and verify JWT", log.Fields{"jwt": req.JWT})
		return
	} else if !ok || username != claims.Username {
		http_response.WriteError(w, errInvalidToken, http.StatusUnauthorized)
		return
	}

	if err := deleteAccount(username); err != nil {
		if err == errUnknownUsername {
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
