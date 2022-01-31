import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import PageServiceTemplate from '../components/PageServiceTemplate';
import ErrorComponent from '../components/ErrorComponent';

import * as STR_UTILS from '../utils/strUtils';
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
  rgbBox: {
    height: 100,
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    marginBottom: 20,
  },
});

const BUTTONS_OFFSET = 20;

const lampStatus = {
  FULL_POWER: 'full_power',
  NORMAL_POWER: 'normal_power',
  POWER_SAVING: 'power_saving',
  FALSE: 'false',
};

const LampPage = () => {
  const [data, setData] = useState({
    color: { blue: 0, green: 0, red: 0 },
    power: lampStatus.FALSE,
  });
  const [error, setError] = useState(null); // {code, message}
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const styles = useStyles();
  const fetchData = async () => {
    try {
      const payload = await loadData();
      setRed(payload.red);
      setGreen(payload.green);
      setBlue(payload.blue);
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deserializeData = (data) => {
    return { color: { red: data.red, green: data.green, blue: data.blue }, power: data.power };
  };

  const loadData = async () => {
    let payload = await GETstatus();
    setData(deserializeData(payload));
    return payload;
  };

  const GETstatus = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_LAMP}/status`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return;
    }
    return statusRes;
  };

  const POSTstatus = async (status) => {
    try {
      let statusRes = await fetch(`${CONSTANTS.API_URL_LAMP}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      }).then((res) => res.json());

      if (statusRes.code) {
        setError(statusRes);
        loadData();
        return;
      }
      setData(deserializeData(statusRes));
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  const POSTcolor = async ({ red, green, blue }) => {
    try {
      let colorRes = await fetch(`${CONSTANTS.API_URL_LAMP}/color`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ red, green, blue }),
      }).then((res) => res.json());

      if (colorRes.code) {
        setError(colorRes);
        loadData();
        return;
      }
      setData(deserializeData(colorRes));
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  const handleSubmit = () => {
    POSTcolor({ red, green, blue });
  };

  return (
    <PageServiceTemplate title="Lamp">
      <Box className={styles.dataContainer}>
        <Typography variant="h6">{JSON.stringify(data, null, 2)}</Typography>
        {error && <ErrorComponent error={error} />}
      </Box>
      <Box className={styles.actionsContainer}>
        <Box
          className={styles.rgbBox}
          sx={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
          onClick={handleSubmit}
        >
          SET COLOR
        </Box>
        {/* RED */}
        <Box sx={{ display: 'flex', width: 200, height: 40 }}>
          <Typography>R: </Typography>
          <Box sx={{ width: 20 }} />
          <Slider
            color="error"
            aria-label="Temperature"
            value={red}
            onChange={(_, val) => {
              setRed(val);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={255}
          />
        </Box>
        {/* GREEN */}
        <Box sx={{ display: 'flex', width: 200, height: 40 }}>
          <Typography>G: </Typography>
          <Box sx={{ width: 20 }} />
          <Slider
            color="success"
            aria-label="Temperature"
            value={green}
            onChange={(_, val) => {
              setGreen(val);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={255}
          />
        </Box>
        {/* BLUE */}
        <Box sx={{ display: 'flex', width: 200, height: 40 }}>
          <Typography>B: </Typography>
          <Box sx={{ width: 20 }} />
          <Slider
            aria-label="Temperature"
            value={blue}
            onChange={(_, val) => {
              setBlue(val);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={255}
          />
        </Box>

        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Power Modes</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={data.power}
            name="radio-buttons-group"
            onChange={(_, val) => {
              POSTstatus(val);
            }}
          >
            {Object.keys(lampStatus).map((k) => {
              return (
                <FormControlLabel
                  key={k}
                  value={lampStatus[k]}
                  control={<Radio />}
                  label={STR_UTILS.capitalize(lampStatus[k])}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Box>
    </PageServiceTemplate>
  );
};

export default LampPage;
