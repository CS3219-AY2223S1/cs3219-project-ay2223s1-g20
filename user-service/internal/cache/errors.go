package cache

type ErrNoConnection struct{}

func (e ErrNoConnection) Error() string {
	return "no connection to cache"
}
