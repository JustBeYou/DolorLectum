import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Slider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import PageServiceTemplate from '../components/PageServiceTemplate';
import ImageIcon from '@mui/icons-material/Image';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ErrorComponent from '../components/ErrorComponent';

import * as CONSTANTS from '../utils/constants';

const useStyles = makeStyles({
  dataContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    backgroundColor: '#ffffff00',
    padding: 20,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 20,
  },
});

const BUTTONS_OFFSET = 40;
const MUSIC_DELAY_FACTOR = 5;

const musicStatus = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
};

const SoundPage = () => {
  const [data, setData] = useState({ songs: [], storage: [], status: {} });
  const [name, setName] = useState('New Song');
  const [time, setTime] = useState({ sec: 0, status: musicStatus.PAUSED, max: 0 });
  const [error, setError] = useState(null); // {code, message}
  const styles = useStyles();

  const fetchData = async () => {
    try {
      await loadData();
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    fetchData();

    const tmr = setInterval(() => {
      setTime(({ sec, status, max }) => {
        if (sec === max || max === 0) {
          loadData();
          return {
            sec: 0,
            status,
            max: 0,
          };
        }
        return {
          sec: sec + (status === musicStatus.PLAYING ? 1 : 0),
          status,
          max,
        };
      });
    }, 1000);
    return () => clearInterval(tmr);
  }, []);

  const loadData = async () => {
    let songs = await GETsongs();
    let storage = await GETstorage();
    let status = await GETstatus();
    if (status.current_second) {
      setTime((prev) => ({
        ...prev,
        sec: status.current_second * MUSIC_DELAY_FACTOR,
        status: status.status,
      }));
    }
    if (status.current_song) {
      setTime((prev) => ({
        ...prev,
        max: status.current_song.length * MUSIC_DELAY_FACTOR,
      }));
    }
    setData({ songs, storage, status });
  };

  const GETstatus = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_SOUND}/status`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return;
    }
    return statusRes;
  };

  const GETstorage = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_SOUND}/storage`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return data.storage;
    }
    return statusRes;
  };

  const GETsongs = async () => {
    let songsRes = await fetch(`${CONSTANTS.API_URL_SOUND}/songs`).then((res) => res.json());
    if (songsRes.code) {
      setError(songsRes);
      return data.songs;
    }
    return songsRes;
  };

  const POSTstatus = async (status) => {
    if (data.songs.length === 0) {
      setError({ code: 400, message: 'There is no song in queue.' });
      return;
    }
    try {
      let statusRes = await fetch(`${CONSTANTS.API_URL_SOUND}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json());

      if (statusRes.code) {
        setError(statusRes);
        loadData();
        return;
      }
      loadData();
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  const POSTstorage = async ({ name, format }) => {
    try {
      let storageRes = await fetch(`${CONSTANTS.API_URL_SOUND}/storage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, format }),
      }).then((res) => res.json());

      if (storageRes.code) {
        setError(storageRes);
        loadData();
        return;
      }
      loadData();
      setError(null);
      return storageRes;
    } catch (e) {
      setError(e);
    }
  };

  const POSTsong = async (id) => {
    try {
      let storageRes = await fetch(`${CONSTANTS.API_URL_SOUND}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      }).then((res) => res.json());

      if (storageRes.code) {
        setError(storageRes);
        loadData();
        return;
      }
      loadData();
      setError(null);
      return storageRes;
    } catch (e) {
      setError(e);
    }
  };

  const PUTstorage = async (id, { size, length }) => {
    try {
      let storageRes = await fetch(`${CONSTANTS.API_URL_SOUND}/storage/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size, length }),
      }).then((res) => res.json());

      console.log({ size, length });
      if (storageRes.code) {
        setError(storageRes);
        loadData();
        return;
      }
      loadData();
      setError(null);
      return storageRes;
    } catch (e) {
      setError(e);
    }
  };

  const handleAddSong = async () => {
    const res = await POSTstorage({ name, format: 'mp3' });
    const length = 5 + Math.floor(Math.random() * 5);
    const size = 1 + Math.random() * 5;
    PUTstorage(res.id, { length, size });
  };

  const renderListItem = ({ id, name, length, size, format }, key, storage = false) => {
    const itemText = (
      <ListItemText
        primary={`${name}.${format}`}
        secondary={`${(length ?? 0) * MUSIC_DELAY_FACTOR}s ${
          Math.round((size ?? 0) * 100) / 100
        }Mbs`}
      />
    );

    if (storage) {
      return (
        <ListItem
          key={key}
          secondaryAction={
            <IconButton edge="end" aria-label="addToQueue" onClick={() => POSTsong(id)}>
              <AddToQueueIcon color="primary" />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          {itemText}
        </ListItem>
      );
    }

    return (
      <ListItem key={key}>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        {itemText}
      </ListItem>
    );
  };

  return (
    <PageServiceTemplate title="Sound System">
      <Box className={styles.dataContainer}>
        <Typography variant="h6">
          {JSON.stringify(
            {
              songsCount: data.songs.length,
              storageCount: data.storage.length,
              status: data.status,
            },
            null,
            2,
          )}
        </Typography>
        {error && <ErrorComponent error={error} />}
      </Box>
      <Box className={styles.actionsContainer}>
        <Box sx={{ display: 'flex', width: 300, height: 40, position: 'relative', left: -20 }}>
          <Typography>{time.sec}</Typography>
          <Box sx={{ width: 30 }} />
          <Slider
            disabled
            aria-label="Time"
            value={time.sec}
            onChange={(_, val) => {
              setTime(val);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={
              data.status?.current_song?.length
                ? data.status?.current_song?.length * MUSIC_DELAY_FACTOR
                : 0
            }
          />
          <Box sx={{ width: 30 }} />
          <Typography>{time.max ? time.max : 0}</Typography>
        </Box>

        <Box sx={{ display: 'flex', position: 'relative', left: -20 }}>
          <Button
            sx={{ marginRight: 10 }}
            variant="contained"
            onClick={() => {
              POSTstatus(musicStatus.PLAYING);
              setTime((prev) => ({ ...prev, status: musicStatus.PLAYING }));
            }}
          >
            PLAY
          </Button>
          <Button
            sx={{ marginRight: 10 }}
            variant="contained"
            onClick={() => {
              POSTstatus(musicStatus.PAUSED);
              setTime((prev) => ({ ...prev, status: musicStatus.PAUSED }));
            }}
          >
            PAUSE
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              POSTstatus(musicStatus.STOPPED);
              setTime((prev) => ({ ...prev, status: musicStatus.STOPPED }));
            }}
          >
            STOP
          </Button>
        </Box>
        <Box sx={{ height: 40 }} />

        <Box
          sx={{
            display: 'flex',
            position: 'relative',
            left: -20,
            bgcolor: 'background.paper',
            width: 400,
            padding: 2,
            justifyContent: 'space-between',
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button variant="outlined" onClick={handleAddSong}>
            ADD SONG
          </Button>
        </Box>

        <Box sx={{ height: BUTTONS_OFFSET }} />
        <Typography color="white" variant="h5">
          Queue
        </Typography>
        <Box sx={{ height: 300, width: 400, overflow: 'auto' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {data.songs.length ? (
              data.songs.map((song, idx) => renderListItem({ ...song }, song.id + idx))
            ) : (
              <Typography>QUEUE IS EMPTY</Typography>
            )}
          </List>
        </Box>

        <Box sx={{ height: BUTTONS_OFFSET }} />

        <Typography color="white" variant="h5">
          Storage List
        </Typography>
        <Box sx={{ height: 300, width: 400, overflow: 'auto' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {data.storage.map((song, idx) => renderListItem({ ...song }, song.id + idx, true))}
          </List>
        </Box>
      </Box>
    </PageServiceTemplate>
  );
};

export default SoundPage;
