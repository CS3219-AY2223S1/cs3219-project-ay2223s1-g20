package db

import (
	"context"
	"time"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(uri, db_name string) error {
	serverOptions := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().ApplyURI(uri).SetServerAPIOptions(serverOptions)
	conf := &mgm.Config{CtxTimeout: 10 * time.Second}
	if err := mgm.SetDefaultConfig(conf, db_name, clientOptions); err != nil {
		return err
	}
	return createCollections()
}

func createCollections() error {
	accountColl := mgm.Coll(&Account{})
	_, err := accountColl.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys:    bson.D{{Key: "username", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	)
	return err
}

func Close() {
	mgm.ResetDefaultConfig()
}
