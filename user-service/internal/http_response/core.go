package http_response

import (
	"encoding/json"
	"net/http"
)

func Write(w http.ResponseWriter, resp map[string]interface{}, httpStatus int) {
	w.WriteHeader(httpStatus)
	jsonResp, _ := json.Marshal(resp)
	w.Write(jsonResp)
}

func WriteSuccess(w http.ResponseWriter, data interface{}, httpStatus int) {
	resp := make(map[string]interface{})
	resp["data"] = data

	Write(w, resp, httpStatus)
}

func WriteError(w http.ResponseWriter, err error, httpStatus int) {
	resp := make(map[string]interface{})
	resp["err"] = err.Error()

	Write(w, resp, httpStatus)
}
