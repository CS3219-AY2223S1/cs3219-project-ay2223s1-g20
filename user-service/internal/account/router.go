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
	r.HandleFunc(ACCOUNTS_URI, registerHandler).Methods(http.MethodPost, http.MethodOptions)

	r.HandleFunc(ACCOUNT_URI, getHandler).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc(ACCOUNT_URI, updateHandler).Methods(http.MethodPut, http.MethodOptions)
	r.HandleFunc(ACCOUNT_URI, deleteHandler).Methods(http.MethodDelete, http.MethodOptions)

	r.HandleFunc(LOGIN_URI, loginHandler).Methods(http.MethodPost, http.MethodOptions)

	r.HandleFunc(LOGOUT_URI, logoutHandler).Methods(http.MethodPost, http.MethodOptions)

	return r
}
