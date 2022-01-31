import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import PageServiceTemplate from '../components/PageServiceTemplate';
import OnOffButton from '../components/OnOffButton';
import NumberController from '../components/NumberController';
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

const MovementPage = () => {
  const [data, setData] = useState({ status: { ready: false }, position: { x: 0, y: 0, z: 0 } });
  const [error, setError] = useState(null); // {code, message}
  const styles = useStyles();

  const fetchData = async () => {
    try {
      loadData();
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadData = async () => {
    let status = await GETready();
    let position = await GETposition();
    setData({ status, position });
  };

  const GETready = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_MOVE}/status`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return;
    }
    return statusRes;
  };

  const GETposition = async () => {
    let positionRes = await fetch(`${CONSTANTS.API_URL_MOVE}/position`).then((res) => res.json());
    if (positionRes.code) {
      setError(positionRes);
      return data.position;
    }
    return positionRes.data;
  };

  const POSTready = async (ready) => {
    try {
      let statusRes = await fetch(`${CONSTANTS.API_URL_MOVE}/status`, {
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

  const POSTposition = async ({ x, y, z }) => {
    try {
      let positionRes = await fetch(`${CONSTANTS.API_URL_MOVE}/position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, z }),
      }).then((res) => res.json());

      console.log({ x, y, z });
      if (positionRes.code) {
        setError(positionRes);
        loadData();
        return;
      } else if (z < 0 || z > 50) {
        setError({ code: 400, message: 'z should be an integer in [0, 50]' });
        return;
      } else if (x < -50 || x > 50 || y < -50 || y > 50) {
        setError({ code: 400, message: 'x, y should be an integer in [-50, 50]' });
        return;
      }
      setData((prevState) => ({ ...prevState, ...{ position: positionRes.data } }));
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <PageServiceTemplate title="TV Movement">
      <Box className={styles.dataContainer}>
        <Typography variant="h6">{JSON.stringify(data, null, 2)}</Typography>
        {error && <ErrorComponent error={error} />}
      </Box>
      <Box className={styles.actionsContainer}>
        <OnOffButton checked={!!data.status.ready} onClick={() => POSTready(!data.status.ready)} />
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <NumberController
          label="x"
          increment={() => POSTposition({ ...data.position, ...{ x: data.position.x + 1 } })}
          decrement={() => POSTposition({ ...data.position, ...{ x: data.position.x - 1 } })}
        />
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <NumberController
          label="y"
          increment={() => POSTposition({ ...data.position, ...{ y: data.position.y + 1 } })}
          decrement={() => POSTposition({ ...data.position, ...{ y: data.position.y - 1 } })}
        />
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <NumberController
          label="z"
          increment={() => POSTposition({ ...data.position, ...{ z: data.position.z + 1 } })}
          decrement={() => POSTposition({ ...data.position, ...{ z: data.position.z - 1 } })}
        />
      </Box>
    </PageServiceTemplate>
  );
};

export default MovementPage;
