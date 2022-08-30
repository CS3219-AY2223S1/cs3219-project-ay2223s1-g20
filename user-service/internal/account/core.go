package account

import (
	"github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g20/user-service/internal/db"
)

func accountExists(username string) bool {
	_, err := db.GetAccountModel(username)
	return err == nil
}

func getAccount(username string) (*db.Account, error) {
	model, err := db.GetAccountModel(username)
	if err != nil {
		return nil, err
	}
	return model, nil
}

func createAccount(cred Credentials) error {
	hash, err := HashPassword(cred.Password)
	if err != nil {
		return err
	}

	model := &db.Account{
		Username:   cred.Username,
		PasswordHS: hash,
	}

	return model.Save()
}

func updatePassword(username, oldPassword, newPassword string) error {
	model, err := db.GetAccountModel(username)
	if err != nil {
		return ErrUnknownUsername
	}

	if !ComparePasswordHash(oldPassword, model.PasswordHS) {
		return ErrIncorrectPassword
	}

	hash, err := HashPassword(newPassword)
	if err != nil {
		return err
	}

	model.PasswordHS = hash

	return model.Update()
}

func deleteAccount(username string) error {
	model, err := db.GetAccountModel(username)
	if err != nil {
		return ErrUnknownUsername
	}

	return model.Delete()
}
