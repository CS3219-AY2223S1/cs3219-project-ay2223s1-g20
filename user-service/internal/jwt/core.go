package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	jwt.RegisteredClaims
	Username string `json:"username"`
}

var jwtKey []byte

func SetKey(key []byte) {
	jwtKey = key
}

func New(username string, expirationTime time.Time) (string, error) {
	if jwtKey == nil {
		return "", ErrInvalidKey
	}

	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func VerifyAndParse(tokenString string, claims *Claims) (bool, error) {
	if jwtKey == nil {
		return false, ErrInvalidKey
	}

	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		},
	)
	if err != nil {
		return false, nil
	}

	return token.Valid, nil
}
