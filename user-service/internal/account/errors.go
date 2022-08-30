package account

import "errors"

var ErrDuplicateUsername = errors.New("duplicate username")

var ErrUnknownUsername = errors.New("unknown username")

var ErrIncorrectPassword = errors.New("incorrect password")

var ErrInvalidToken = errors.New("invalid token")
