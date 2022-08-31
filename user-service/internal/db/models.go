package db

import (
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

type Account struct {
	mgm.DefaultModel `bson:",inline"`

	Username   string `bson:"username"`
	PasswordHS string `bson:"password_hs"`
}

func GetAccountModel(username string) (*Account, error) {
	a := &Account{}
	err := mgm.Coll(a).First(bson.M{"username": username}, a)
	if err != nil {
		return nil, err
	}
	return a, nil
}

func (a *Account) Save() error {
	return mgm.Coll(a).Create(a)
}

func (a *Account) Update() error {
	return mgm.Coll(a).Update(a)
}

func (a *Account) Delete() error {
	return mgm.Coll(a).Delete(a)
}
