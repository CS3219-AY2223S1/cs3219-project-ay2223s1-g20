package account

import (
	"encoding/json"
	"net/http"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/http_response"
	"github.com/gorilla/mux"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if accountExists(req.Username) {
		http_response.WriteError(w, ErrDuplicateUsername{}, http.StatusBadRequest)
		return
	}

	if err := createAccount(req.Username, req.Password); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {

}

type UpdatePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam{}, http.StatusBadRequest)
		return
	}

	if !accountExists(username) {
		http_response.WriteError(w, ErrUnknownUsername{}, http.StatusBadRequest)
		return
	}

	var req UpdatePasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http_response.WriteError(w, err, http.StatusBadRequest)
		return
	}

	if err := updatePassword(username, req.OldPassword, req.NewPassword); err != nil {
		if _, ok := err.(ErrIncorrectPassword); !ok {
			http_response.WriteError(w, err, http.StatusBadRequest)
		} else {
			http_response.WriteError(w, err, http.StatusInternalServerError)
		}
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http_response.WriteError(w, http_response.ErrMissingPathParam{}, http.StatusBadRequest)
		return
	}

	if !accountExists(username) {
		http_response.WriteError(w, ErrUnknownUsername{}, http.StatusBadRequest)
		return
	}

	if err := deleteAccount(username); err != nil {
		http_response.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	http_response.WriteSuccess(w, nil, http.StatusOK)
}
