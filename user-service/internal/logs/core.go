package logs

import (
	log "github.com/sirupsen/logrus"
)

func WithError(err error) *log.Entry {
	return log.WithFields(log.Fields{
		"error": err,
	})
}
