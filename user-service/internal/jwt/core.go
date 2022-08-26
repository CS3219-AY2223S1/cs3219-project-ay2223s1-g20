package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var jwtKey = []byte("secret")

type Claims struct {
	jwt.RegisteredClaims
	Username string `json:"username"`
}

func New(username string, expirationTime time.Time) (string, error) {
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func VerifyToken(username, tokenString string) (bool, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		},
	)
	if err != nil {
		return false, err
	}

	return token.Valid, nil
}
