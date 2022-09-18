package http_response

import "errors"

var ErrMissingPathParam = errors.New("missing path parameter")

var ErrMalformedRequestBody = errors.New("malformed request body")
