# API

## General

Successful Response 
```json
{
	"data": {}
}
```

Error Response
```json
{
	"err": "string"
}
```

## Routes

### POST /accounts
Register a new account

**Request**
```json
{
	"username": "string",
	"password": "string"
}
```

**Responses**
- Success: 201 Created
```json
"data": {
	"jwt": "string"
}
```
- Request body wrong format: 400 Bad Request
- Existing username: 409 Conflict
- Server error: 500 Internal Server Error

### POST /login
Login to an existing account

**Request**
```
{
	"username": "string",
	"password": "string"
}
```

**Responses**
- Success: 200 OK
```json
"data": {
	"jwt": "string"
}
```
- Request body wrong format: 400 Bad Request
- Incorrect password: 401 Unauthorized
- Username does not exist: 404 Not Found
- Server error: 500 Internal Server Error

### POST /logout
Logout from an account

**Request**
```json
{
	"jwt": "string"
}
```

**Responses**
- Success: 200 OK
- Request body wrong format: 400 Bad Request
- Invalid JWT: 401 Unauthorized
- Server error: 500 Internal Server Error

### GET /accounts/{username}
Retrieve account information

**Request**
```json
{
	"username": "string"
}
```

**Responses**
- Success: 200 OK
```json
"data": {
	"username": "string"
}
```
- Request body wrong format: 400 Bad Request
- Invalid JWT: 401 Unauthorized
- Username does not exist: 404 Not Found
- Server error: 500 Internal Server Error

### PUT /accounts/{username}
Update account information

**Request**
```json
{
    "jwt": "string",
	"old_password": "string",
    "new_password": "string"
}
```

**Responses**
- Success: 200 OK
- Request body wrong format: 400 Bad Request
- Invalid JWT: 401 Unauthorized
- Username does not exist: 404 Not Found
- Server error: 500 Internal Server Error

### DELETE /accounts/{username}
Delete account

**Request**
```json
{
    "jwt": "string"
}
```

**Responses**
- Success: 200 OK
- Request body wrong format: 400 Bad Request
- Invalid JWT: 401 Unauthorized
- Username does not exist: 404 Not Found
- Server error: 500 Internal Server Error
