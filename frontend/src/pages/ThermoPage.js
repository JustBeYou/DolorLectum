import { useEffect, useState } from 'react';
import { Box, Typography, Slider, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import PageServiceTemplate from '../components/PageServiceTemplate';
import OnOffButton from '../components/OnOffButton';
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
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 20,
  },
});

const BUTTONS_OFFSET = 20;

const ThermoPage = () => {
  const [data, setData] = useState({ ready: false, realtemp: 30, temp: 10 });
  const [error, setError] = useState(null); // {code, message}
  const [temp, setTemp] = useState(30);
  const styles = useStyles();

  const fetchData = async () => {
    try {
      const tmp = await loadData();
      setTemp(tmp);
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadData = async () => {
    let payload = await GETready();
    setData(payload);
    return payload.temp;
  };

  const GETready = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_THERMO}/status`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return;
    }
    return statusRes;
  };

  const POSTready = async (ready) => {
    try {
      let statusRes = await fetch(`${CONSTANTS.API_URL_THERMO}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ready }),
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

  const POSTtemp = async (temp) => {
    if (!data.ready) {
      setError({ code: 400, message: 'Device is not ready' });
      return;
    }

    try {
      let positionRes = await fetch(`${CONSTANTS.API_URL_THERMO}/temp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temp }),
      }).then((res) => res.json());

      console.log({ temp });
      if (positionRes.code) {
        setError(positionRes);
        loadData();
        return;
      }

      loadData();
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <PageServiceTemplate title="Thermo System">
      <Box className={styles.dataContainer}>
        <Typography variant="h6">{JSON.stringify(data, null, 2)}</Typography>
        {error && <ErrorComponent error={error} />}
      </Box>
      <Box className={styles.actionsContainer}>
        <OnOffButton checked={!!data.ready} onClick={() => POSTready(!data.ready)} />
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <Box sx={{ display: 'flex', width: 300, height: 40 }}>
          <Typography>Temperature(*C): </Typography>
          <Box sx={{ width: 20 }} />
          <Slider
            color="success"
            aria-label="Temperature"
            value={temp}
            onChange={(_, val) => {
              setTemp(val);
            }}
            valueLabelDisplay="auto"
            min={20}
            max={31}
          />
        </Box>
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <Button variant="contained" onClick={() => POSTtemp(temp)}>
          SET TEMP
        </Button>
      </Box>
    </PageServiceTemplate>
  );
};

export default ThermoPage;
