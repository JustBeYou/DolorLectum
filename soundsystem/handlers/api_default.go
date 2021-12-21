package handlers

import (
	"errors"
	"fmt"
	"github.com/labstack/echo/v4"
	"math/rand"
	"net/http"
	"soundsystem/models"
	"strconv"
	"time"
)

const IdleStatus = "idle"
const PlayingStatus = "playing"
const PausedStatus = "paused"

var storedSongs = make(map[string]models.StoredSong)
var playingQueue = make([]string, 0)
var status = IdleStatus
var currentSecond = 0

func BackgroundJob() {
	for {
		time.Sleep(5 * time.Second)

		if status != PlayingStatus {
			continue
		}

		if len(playingQueue) == 0 {
			status = IdleStatus
			currentSecond = 0
			continue
		}

		currentSecond += 5
		if currentSecond >= int(storedSongs[playingQueue[0]].Length) {
			fmt.Println("Song finished ", storedSongs[playingQueue[0]].Name)
			playingQueue = playingQueue[1:]
			currentSecond = 0
		} else {
			fmt.Printf("%d/%d song %s\n", currentSecond, int(storedSongs[playingQueue[0]].Length),
				storedSongs[playingQueue[0]].Name)
		}
	}
}

// SongsGet -
func (c *Container) SongsGet(ctx echo.Context) error {
	songs := make([]models.StoredSong, len(playingQueue))
	for i, id := range playingQueue {
		songs[i] = storedSongs[id]
	}

	return ctx.JSON(http.StatusOK, songs)
}

// SongsIDelete -
func (c *Container) SongsIDelete(ctx echo.Context) error {
	i, err := getIndexParam(ctx)
	if err != nil {
		return err
	}

	playingQueue = append(playingQueue[:i], playingQueue[i+1:]...)
	return ctx.JSON(http.StatusOK, models.Message{
		Message: "Deleted",
	})
}

// SongsIGet -
func (c *Container) SongsIGet(ctx echo.Context) error {
	i, err := getIndexParam(ctx)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, storedSongs[playingQueue[i]])
}

// SongsPost -
func (c *Container) SongsPost(ctx echo.Context) error {
	obj := new(models.InlineObject)
	err := getReqBodyInto(ctx, obj)
	if err != nil {
		return err
	}

	song, exists := storedSongs[obj.Id]
	if !exists || song.Size == 0 {
		return ctx.JSON(http.StatusNotFound, "Song not found in storage")
	}

	playingQueue = append(playingQueue, song.Id)
	qsong := models.QueuedSong{
		Name:   song.Name,
		Format: song.Format,
		Id:     song.Id,
		Length: song.Length,
		Size:   song.Size,
		Index:  int32(len(playingQueue) - 1),
	}

	return ctx.JSON(http.StatusOK, qsong)
}

// StatusGet -
func (c *Container) StatusGet(ctx echo.Context) error {
	var qsong models.QueuedSong
	if len(playingQueue) > 0 {
		song := storedSongs[playingQueue[0]]
		qsong = models.QueuedSong{
			Name:   song.Name,
			Format: song.Format,
			Id:     song.Id,
			Length: song.Length,
			Size:   song.Size,
			Index:  int32(len(playingQueue) - 1),
		}
	}

	return ctx.JSON(http.StatusOK, models.Status{
		Status:        status,
		CurrentSecond: int32(currentSecond),
		CurrentSong:   qsong,
	})
}

// StatusPost -
func (c *Container) StatusPost(ctx echo.Context) error {
	obj := new(models.InlineObject1)
	err := getReqBodyInto(ctx, obj)
	if err != nil {
		return err
	}

	if obj.Status == PlayingStatus && len(playingQueue) == 0 {
		return ctx.JSON(http.StatusBadRequest, models.Message{
			Message: "Can't start playing, the queue is empty",
		})
	}

	status = obj.Status

	if obj.Status == IdleStatus {
		playingQueue = make([]string, 0)
		currentSecond = 0
	}

	return c.StatusGet(ctx)
}

// StorageGet -
func (c *Container) StorageGet(ctx echo.Context) error {
	songs := make([]models.StoredSong, len(storedSongs))
	i := 0
	for _, v := range storedSongs {
		songs[i] = v
		i++
	}

	return ctx.JSON(http.StatusOK, songs)
}

// StorageIdDelete -
func (c *Container) StorageIdDelete(ctx echo.Context) error {
	return ctx.JSON(http.StatusNotImplemented, models.HelloWorld{
		Message: "I'm too lazy",
	})
}

// StorageIdGet -
func (c *Container) StorageIdGet(ctx echo.Context) error {
	id := ctx.Param("id")
	song, exists := storedSongs[id]
	if !exists {
		return ctx.JSON(http.StatusNotFound, models.Message{
			Message: "Song id not found in storage",
		})
	}

	return ctx.JSON(http.StatusOK, song)
}

// StorageIdPut -
func (c *Container) StorageIdPut(ctx echo.Context) error {
	id := ctx.Param("id")
	song, exists := storedSongs[id]
	if !exists {
		return ctx.JSON(http.StatusNotFound, models.Message{
			Message: "Song id not found in storage",
		})
	}

	// Fake implementation
	song.Size = rand.Float32() * 100
	song.Length = rand.Int31()%200 + 1
	storedSongs[id] = song

	return ctx.JSON(http.StatusOK, storedSongs[id])
}

// StoragePost -
func (c *Container) StoragePost(ctx echo.Context) error {
	obj := new(models.BaseSong)
	err := getReqBodyInto(ctx, obj)
	if err != nil {
		return err
	}

	id := strconv.Itoa(rand.Int())
	storedSongs[id] = models.StoredSong{
		Name:   obj.Name,
		Format: obj.Format,
		Id:     id,
		Length: 0,
		Size:   0,
	}

	return ctx.JSON(http.StatusOK, storedSongs[id])
}

func getIndexParam(ctx echo.Context) (int, error) {
	i, err0 := strconv.Atoi(ctx.Param("i"))

	if err0 != nil {
		err := ctx.JSON(http.StatusBadRequest, models.Message{
			Message: "Index must be an integer",
		})
		if err != nil {
			return 0, err
		}
		return 0, err0
	}

	if i >= len(playingQueue) {
		err := ctx.JSON(http.StatusNotFound, models.Message{
			Message: "Song index not found",
		})
		if err != nil {
			return 0, err
		}
		return 0, errors.New("not found")
	}

	return i, nil
}

func getReqBodyInto(ctx echo.Context, obj interface{}) error {
	err0 := ctx.Bind(obj)
	if err0 != nil {
		fmt.Println("Invalid body format ", err0)
		err := ctx.JSON(http.StatusBadRequest, "Invalid body format")
		if err != nil {
			return err
		}
		return err0
	}

	return nil
}
