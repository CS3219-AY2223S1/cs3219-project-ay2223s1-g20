package account

import "errors"

var errDuplicateUsername = errors.New("duplicate username")

var errUnknownUsername = errors.New("unknown username")

var errIncorrectPassword = errors.New("incorrect password")

var errInvalidToken = errors.New("invalid token")
