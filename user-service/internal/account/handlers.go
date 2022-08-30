package account

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cache"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/http_response"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/jwt"
	"github.com/gorilla/mux"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
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
		http_response.WriteError(w, ErrDuplicateUsername{}, http.StatusConflict)
		return
	}

	if err := createAccount(req.Username, req.Password); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token, err := jwt.New(req.Username, expirationTime)
	if err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	http_response.WriteSuccess(w, RegisterResponse{JWT: token}, http.StatusOK)
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
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
		http_response.WriteError(w, ErrUnknownUsername{}, http.StatusNotFound)
		return
	}

	account, _ := getAccount(req.Username)

	if !ComparePasswordHash(req.Password, account.PasswordHS) {
		http_response.WriteError(w, ErrIncorrectPassword{}, http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token, err := jwt.New(req.Username, expirationTime)
	if err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	http_response.WriteSuccess(w, LoginResponse{JWT: token}, http.StatusOK)
}

type LogoutRequest struct {
	Username string `json:"username"`
	JWT      string `json:"jwt"`
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	var req LogoutRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if ok, err := jwt.VerifyToken(req.Username, req.JWT); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	} else if !ok {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
		return
	}

	if err := cache.Set(req.JWT, 0, 24*time.Hour); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
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
		http_response.WriteError(w, http_response.ErrMissingPathParam{}, http.StatusBadRequest)
		return
	}

	var req GetRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if ok, err := jwt.VerifyToken(username, req.JWT); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	} else if !ok {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
		return
	}

	account, err := getAccount(username)
	if err != nil {
		http_response.WriteError(w, ErrUnknownUsername{}, http.StatusNotFound)
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
		http_response.WriteError(w, http_response.ErrMissingPathParam{}, http.StatusBadRequest)
		return
	}

	var req UpdatePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
		return
	}

	if ok, err := jwt.VerifyToken(username, req.JWT); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	} else if !ok {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
	}

	if err := updatePassword(username, req.OldPassword, req.NewPassword); err != nil {
		if _, ok := err.(ErrUnknownUsername); ok {
			http_response.WriteError(w, err, http.StatusNotFound)
		} else if _, ok := err.(ErrIncorrectPassword); ok {
			http_response.WriteError(w, err, http.StatusBadRequest)
		} else {
			http_response.WriteError(w, err, http.StatusInternalServerError)
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
		http_response.WriteError(w, http_response.ErrMissingPathParam{}, http.StatusBadRequest)
		return
	}

	var req DeleteRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if _, err := cache.Get(req.JWT); err == nil {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
		return
	}

	if ok, err := jwt.VerifyToken(username, req.JWT); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	} else if !ok {
		http_response.WriteError(w, ErrInvalidToken{}, http.StatusUnauthorized)
		return
	}

	if err := deleteAccount(username); err != nil {
		if _, ok := err.(ErrUnknownUsername); ok {
			http_response.WriteError(w, err, http.StatusNotFound)
			return
		}
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}
