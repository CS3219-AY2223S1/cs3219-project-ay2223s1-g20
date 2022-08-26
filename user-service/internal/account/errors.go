package account

type ErrDuplicateUsername struct{}

func (e ErrDuplicateUsername) Error() string {
	return "duplicate username"
}

type ErrUnknownUsername struct{}

func (e ErrUnknownUsername) Error() string {
	return "unknown username"
}

type ErrIncorrectPassword struct{}

func (e ErrIncorrectPassword) Error() string {
	return "incorrect password"
}

type ErrInvalidToken struct{}

func (e ErrInvalidToken) Error() string {
	return "invalid token"
}
