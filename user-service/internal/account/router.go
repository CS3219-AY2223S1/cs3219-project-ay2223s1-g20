package account

import (
	"net/http"

	"github.com/gorilla/mux"
)

const ACCOUNTS_URI = "/accounts"
const ACCOUNT_URI = "/accounts/{username}"
const LOGIN_URI = "/login"
const LOGOUT_URI = "/logout"

func NewRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc(ACCOUNTS_URI, registerHandler).Methods(http.MethodPost)

	r.HandleFunc(ACCOUNT_URI, getHandler).Methods(http.MethodGet)
	r.HandleFunc(ACCOUNT_URI, updateHandler).Methods(http.MethodPut)
	r.HandleFunc(ACCOUNT_URI, deleteHandler).Methods(http.MethodDelete)

	r.HandleFunc(LOGIN_URI, loginHandler).Methods(http.MethodPost)

	r.HandleFunc(LOGOUT_URI, logoutHandler).Methods(http.MethodPost)

	return r
}
