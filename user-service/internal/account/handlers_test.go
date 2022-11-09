package account

import (
	"bytes"
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/cache"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/db"
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/jwt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type errorResponse struct {
	Err string `json:"err"`
}

type TestCase struct {
	Handler string
	Outcome string
	Func    func(t *testing.T)
}

func (c TestCase) Name() string {
	return c.Handler + "_" + c.Outcome
}

func TestHandlers(t *testing.T) {
	tests := []TestCase{
		{
			Handler: "registerHandler",
			Outcome: "success",
			Func:    testRegisterSuccess,
		},
		{
			Handler: "registerHandler",
			Outcome: "duplicateUsername",
			Func:    testRegisterDuplicateUsername,
		},
		{
			Handler: "loginHandler",
			Outcome: "success",
			Func:    testLoginSuccess,
		},
		{
			Handler: "loginHandler",
			Outcome: "unknownUsername",
			Func:    testLoginUnknownUsername,
		},
		{
			Handler: "loginHandler",
			Outcome: "incorrectPassword",
			Func:    testLoginIncorrectPassword,
		},
		{
			Handler: "logoutHandler",
			Outcome: "success",
			Func:    testLogoutSuccess,
		},
		{
			Handler: "logoutHandler",
			Outcome: "invalidToken",
			Func:    testLogoutInvalidToken,
		},
		{
			Handler: "getHandler",
			Outcome: "success",
			Func:    testGetAccountSuccess,
		},
		{
			Handler: "getHandler",
			Outcome: "loggedOut",
			Func:    testGetAccountLoggedOut,
		},
		{
			Handler: "getHandler",
			Outcome: "expiredToken",
			Func:    testGetAccountExpiredToken,
		},
		{
			Handler: "getHandler",
			Outcome: "unknownUsername",
			Func:    testGetAccountUnknownUsername,
		},
		{
			Handler: "updateHandler",
			Outcome: "success",
			Func:    testUpdateAccountSuccess,
		},
		{
			Handler: "updateHandler",
			Outcome: "loggedOut",
			Func:    testUpdateAccountLoggedOut,
		},
		{
			Handler: "updateHandler",
			Outcome: "expiredToken",
			Func:    testUpdateAccountExpiredToken,
		},
		{
			Handler: "updateHandler",
			Outcome: "unknownUsername",
			Func:    testUpdateAccountUnknownUsername,
		},
		{
			Handler: "deleteHandler",
			Outcome: "success",
			Func:    testDeleteAccountSuccess,
		},
		{
			Handler: "deleteHandler",
			Outcome: "loggedOut",
			Func:    testDeleteAccountLoggedOut,
		},
		{
			Handler: "deleteHandler",
			Outcome: "expiredToken",
			Func:    testDeleteAccountExpiredToken,
		},
		{
			Handler: "deleteHandler",
			Outcome: "unknownUsername",
			Func:    testDeleteAccountUnknownUsername,
		},
	}

	for _, test := range tests {
		teardown, err := setup()
		if err != nil {
			t.Fatalf("error during setup: %v", err)
		}
		t.Run(test.Name(), test.Func)
		if err = teardown(); err != nil {
			t.Fatalf("error during teardown: %v", err)
		}
	}
}

func testRegisterSuccess(t *testing.T) {
	cred := credentials{
		Username: "testRegisterSuccess",
		Password: "1234567890",
	}
	body, _ := json.Marshal(registerRequest{cred})
	r := httptest.NewRequest(http.MethodPost, ACCOUNTS_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusCreated {
		t.Errorf("expected status code %d, got %d", http.StatusCreated, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	type testRegisterSuccessResponse struct {
		Data registerResponse `json:"data"`
	}
	response := testRegisterSuccessResponse{}
	json.Unmarshal(data, &response)

	token := response.Data.JWT
	claims := jwt.Claims{}
	_, err = jwt.VerifyAndParse(token, &claims)
	if err != nil {
		t.Errorf("expected valid token, got %s", token)
	}

	if claims.Username != cred.Username {
		t.Errorf("expected username in token: %s, got %s", cred.Username, claims.Username)
	}
}

func testRegisterDuplicateUsername(t *testing.T) {
	cred := credentials{
		Username: "testRegisterDuplicateUsername",
		Password: "1234567890",
	}
	createTestAccount(cred, t)

	body, _ := json.Marshal(registerRequest{cred})
	r := httptest.NewRequest(http.MethodPost, ACCOUNTS_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusConflict {
		t.Errorf("expected status code %d, got %d", http.StatusConflict, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errDuplicateUsername.Error() {
		t.Errorf("expected error %v, got %v", errDuplicateUsername.Error(), response.Err)
	}
}

func testLoginSuccess(t *testing.T) {
	cred := credentials{
		Username: "testLoginSuccess",
		Password: "1234567890",
	}
	createTestAccount(cred, t)

	body, _ := json.Marshal(loginRequest{cred})
	r := httptest.NewRequest(http.MethodPost, LOGIN_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	type testLoginSuccessResponse struct {
		Data loginResponse `json:"data"`
	}
	response := testLoginSuccessResponse{}
	json.Unmarshal(data, &response)

	token := response.Data.JWT
	claims := jwt.Claims{}
	_, err = jwt.VerifyAndParse(token, &claims)
	if err != nil {
		t.Errorf("expected valid token, got %s", token)
	}

	if claims.Username != cred.Username {
		t.Errorf("expected username in token: %s, got %s", cred.Username, claims.Username)
	}
}

func testLoginUnknownUsername(t *testing.T) {
	cred := credentials{
		Username: "testLoginUnknownUsername",
		Password: "1234567890",
	}

	body, _ := json.Marshal(loginRequest{cred})
	r := httptest.NewRequest(http.MethodPost, LOGIN_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Errorf("expected status code %d, got %d", http.StatusNotFound, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errUnknownUsername.Error() {
		t.Errorf("expected error %v, got %v", errUnknownUsername.Error(), response.Err)
	}
}

func testLoginIncorrectPassword(t *testing.T) {
	cred := credentials{
		Username: "testLoginIncorrectPassword",
		Password: "1234567890",
	}
	createTestAccount(cred, t)

	body, _ := json.Marshal(loginRequest{credentials: credentials{
		Username: cred.Username,
		Password: "incorrectPassword",
	}})
	r := httptest.NewRequest(http.MethodPost, LOGIN_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errIncorrectPassword.Error() {
		t.Errorf("expected error %v, got %v", errIncorrectPassword.Error(), response.Err)
	}
}

func testLogoutSuccess(t *testing.T) {
	cred := credentials{
		Username: "testLogoutSuccess",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	body, _ := json.Marshal(logoutRequest{token})
	r := httptest.NewRequest(http.MethodPost, LOGOUT_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	if _, err := cache.Get(token); err != nil {
		t.Errorf("token was not blacklisted: %s", token)
	}
}

func testLogoutInvalidToken(t *testing.T) {
	cred := credentials{
		Username: "testLogoutInvalidToken",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	jwt.SetKey([]byte("invalidKey"))
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)
	jwt.SetKey([]byte("test_secret"))

	body, _ := json.Marshal(logoutRequest{token})
	r := httptest.NewRequest(http.MethodPost, LOGOUT_URI, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error %v, got %v", errInvalidToken.Error(), response.Err)
	}
}

func testGetAccountSuccess(t *testing.T) {
	cred := credentials{
		Username: "testGetAccountSuccess",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	body, _ := json.Marshal(getRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodGet, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	type testGetSuccessResponse struct {
		Data getResponse `json:"data"`
	}
	response := testGetSuccessResponse{}
	json.Unmarshal(data, &response)

	if response.Data.Username != cred.Username {
		t.Errorf("expected username: %s, got %s", cred.Username, response.Data.Username)
	}
}

func testGetAccountLoggedOut(t *testing.T) {
	cred := credentials{
		Username: "testGetAccountLoggedOut",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)
	logoutFromAccount(token, t)

	body, _ := json.Marshal(getRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodGet, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testGetAccountExpiredToken(t *testing.T) {
	cred := credentials{
		Username: "testGetAccountExpiredToken",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(-24*time.Hour), t)

	body, _ := json.Marshal(getRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodGet, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testGetAccountUnknownUsername(t *testing.T) {
	cred := credentials{
		Username: "testGetAccountUnknownUsername",
		Password: "1234567890",
	}
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	body, _ := json.Marshal(getRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodGet, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Errorf("expected status code %d, got %d", http.StatusNotFound, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errUnknownUsername.Error() {
		t.Errorf("expected error: %s, got %s", errUnknownUsername.Error(), response.Err)
	}
}

func testUpdateAccountSuccess(t *testing.T) {
	cred := credentials{
		Username: "testUpdateAccountSuccess",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	newPassword := "0987654321"
	body, _ := json.Marshal(updatePasswordRequest{
		OldPassword: cred.Password,
		NewPassword: newPassword,
		JWT:         token,
	})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodPut, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	model, err := getAccount(cred.Username)
	if err != nil {
		t.Errorf("failed to get account, username: %s", cred.Username)
	}

	if !comparePasswordHash(newPassword, model.PasswordHS) {
		t.Errorf("failed to update password")
	}
}

func testUpdateAccountLoggedOut(t *testing.T) {
	cred := credentials{
		Username: "testUpdateAccountLoggedOut",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)
	logoutFromAccount(token, t)

	newPassword := "0987654321"
	body, _ := json.Marshal(updatePasswordRequest{
		OldPassword: cred.Password,
		NewPassword: newPassword,
		JWT:         token,
	})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodPut, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testUpdateAccountExpiredToken(t *testing.T) {
	cred := credentials{
		Username: "testUpdateAccountExpiredToken",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(-24*time.Hour), t)

	newPassword := "0987654321"
	body, _ := json.Marshal(updatePasswordRequest{
		OldPassword: cred.Password,
		NewPassword: newPassword,
		JWT:         token,
	})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodPut, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testUpdateAccountUnknownUsername(t *testing.T) {
	cred := credentials{
		Username: "testUpdateAccountUnknownUsername",
		Password: "1234567890",
	}
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	newPassword := "0987654321"
	body, _ := json.Marshal(updatePasswordRequest{
		OldPassword: cred.Password,
		NewPassword: newPassword,
		JWT:         token,
	})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodPut, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Errorf("expected status code %d, got %d", http.StatusNotFound, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errUnknownUsername.Error() {
		t.Errorf("expected error: %s, got %s", errUnknownUsername.Error(), response.Err)
	}
}

func testDeleteAccountSuccess(t *testing.T) {
	cred := credentials{
		Username: "testDeleteAccountSuccess",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	body, _ := json.Marshal(deleteRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodDelete, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	if accountExists(cred.Username) {
		t.Errorf("failed to delete account")
	}
}
func testDeleteAccountLoggedOut(t *testing.T) {
	cred := credentials{
		Username: "testDeleteAccountLoggedOut",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)
	logoutFromAccount(token, t)

	body, _ := json.Marshal(deleteRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodDelete, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testDeleteAccountExpiredToken(t *testing.T) {
	cred := credentials{
		Username: "testDeleteAccountExpiredToken",
		Password: "1234567890",
	}
	createTestAccount(cred, t)
	token := loginToAccount(cred, time.Now().Add(-24*time.Hour), t)

	body, _ := json.Marshal(deleteRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodDelete, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status code %d, got %d", http.StatusUnauthorized, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errInvalidToken.Error() {
		t.Errorf("expected error: %s, got %s", errInvalidToken.Error(), response.Err)
	}
}

func testDeleteAccountUnknownUsername(t *testing.T) {
	cred := credentials{
		Username: "testDeleteAccountUnknownUsername",
		Password: "1234567890",
	}
	token := loginToAccount(cred, time.Now().Add(24*time.Hour), t)

	body, _ := json.Marshal(deleteRequest{token})
	uri := strings.Replace(ACCOUNT_URI, "{username}", cred.Username, 1)
	r := httptest.NewRequest(http.MethodDelete, uri, bytes.NewReader(body))
	w := httptest.NewRecorder()

	NewRouter().ServeHTTP(w, r)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusNotFound {
		t.Errorf("expected status code %d, got %d", http.StatusNotFound, res.StatusCode)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("error reading response: %v", err)
	}

	response := errorResponse{}
	json.Unmarshal(data, &response)

	if response.Err != errUnknownUsername.Error() {
		t.Errorf("expected error: %s, got %s", errUnknownUsername.Error(), response.Err)
	}
}

func setup() (func() error, error) {
	dbURI, ok := os.LookupEnv("DB_URI")

	if !ok {
		if err := godotenv.Load("../../.env.test"); err != nil {
			return nil, err
		}
	}

	dbURI = os.Getenv("DB_URI")
	dbName := os.Getenv("DB_NAME")

	if err := db.Connect(dbURI, dbName); err != nil {
		return nil, err
	}

	cacheAddress := os.Getenv("CACHE_ADDRESS")
	if err := cache.Connect(cacheAddress); err != nil {
		return nil, err
	}

	jwt.SetKey([]byte("test_secret"))

	return func() error {
		db.Close()
		cache.Close()

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbURI))
		if err != nil {
			return err
		}

		return client.Database(dbName).Drop(context.Background())
	}, nil
}

func createTestAccount(cred credentials, t *testing.T) {
	if err := createAccount(cred); err != nil {
		t.Errorf("failed to create test account: %v", err)
	}
}

func loginToAccount(cred credentials, expirationTime time.Time, t *testing.T) string {
	token, err := jwt.New(cred.Username, expirationTime)
	if err != nil {
		t.Errorf("failed to create JWT")
		return ""
	}
	return token
}

func logoutFromAccount(token string, t *testing.T) {
	if err := cache.Set(token, 0, 24*time.Hour); err != nil {
		t.Errorf("failed to log out with token: %s, error: %v", token, err)
	}
}
