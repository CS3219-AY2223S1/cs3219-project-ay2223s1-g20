package http_response

type ErrMissingPathParam struct{}

func (e ErrMissingPathParam) Error() string {
	return "missing path parameter"
}
