package cache

import (
	"context"
	"time"

	"github.com/go-redis/cache/v8"
	"github.com/go-redis/redis/v8"
)

var rdb *redis.Client
var c *cache.Cache

func Connect(url string) error {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return err
	}
	rdb = redis.NewClient(opt)

	c = cache.New(&cache.Options{
		Redis:      rdb,
		LocalCache: cache.NewTinyLFU(1000, time.Minute),
	})

	return nil
}

func Close() {
	rdb.Close()
	c = nil
}

func Set(key string, value interface{}, ttl time.Duration) error {
	if c == nil {
		return ErrNoConnection{}
	}

	item := &cache.Item{
		Ctx:   context.Background(),
		Key:   key,
		Value: value,
		TTL:   ttl,
	}

	return c.Set(item)
}

func Get(key string) (interface{}, error) {
	if c == nil {
		return nil, ErrNoConnection{}
	}

	var value interface{}
	if err := c.Get(context.Background(), key, &value); err != nil {
		return nil, err
	}
	return value, nil
}
