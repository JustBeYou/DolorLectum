package handlers

import "soundsystem/models"

// Container will hold all dependencies for your application.
type Container struct {
	storedSongs           map[string]models.StoredSong
	playingQueue          []string
	status                string
	currentSecond         int
	sleepTimeMilliseconds int32
	shouldStop            bool
}

// NewContainer returns an empty or an initialized container for your handlers.
func NewContainer() (Container, error) {
	c := Container{
		storedSongs:           make(map[string]models.StoredSong),
		playingQueue:          make([]string, 0),
		status:                IdleStatus,
		currentSecond:         0,
		sleepTimeMilliseconds: 5000,
		shouldStop:            false,
	}
	return c, nil
}
