import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
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

const vacuumActions = {
  CLEAN: 'clean',
  CANCEL: 'cancel',
};

const VacuumPage = () => {
  const [data, setData] = useState({ status: { ready: false }, action: vacuumActions.CANCEL });
  const [error, setError] = useState(null); // "string"
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
    setData({ ...data, status });
  };

  const GETready = async () => {
    let statusRes = await fetch(`${CONSTANTS.API_URL_VACUUM}/status`).then((res) => res.json());
    if (statusRes.code) {
      setError(statusRes);
      return;
    }
    return statusRes;
  };

  const POSTready = async (ready) => {
    try {
      let statusRes = await fetch(`${CONSTANTS.API_URL_VACUUM}/status`, {
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
      if (!ready) {
        setData({ status: { ready: false }, action: vacuumActions.CANCEL });
      } else {
        setData({ status: { ready: true }, action: vacuumActions.CANCEL });
      }
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  const POSTaction = async (action) => {
    try {
      let actionRes = await fetch(`${CONSTANTS.API_URL_VACUUM}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      }).then((res) => res.json());

      console.log({ actionRes });
      console.log({ action });
      if (actionRes.code) {
        setError(actionRes);
        loadData();
        return;
      } else if (typeof actionRes === 'string' || actionRes instanceof String) {
        setError({ code: 409, message: actionRes });
        return;
      }

      if (actionRes.action !== vacuumActions.CANCEL) {
        setData((prevState) => ({ ...prevState, ...actionRes }));
      } else {
        setData({ status: { ready: false }, ...actionRes });
      }

      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <PageServiceTemplate title="Vacuum Cleaner">
      <Box className={styles.dataContainer}>
        <Typography variant="h6">{JSON.stringify(data, null, 2)}</Typography>
        {error && <ErrorComponent error={error} />}
      </Box>
      <Box className={styles.actionsContainer}>
        <OnOffButton checked={!!data.status.ready} onClick={() => POSTready(!data.status.ready)} />
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <Button color="success" onClick={() => POSTaction(vacuumActions.CLEAN)} variant="contained">
          Clean
        </Button>
        <Box sx={{ height: BUTTONS_OFFSET }} />
        <Button color="error" onClick={() => POSTaction(vacuumActions.CANCEL)} variant="contained">
          Cancel
        </Button>
      </Box>
    </PageServiceTemplate>
  );
};

export default VacuumPage;
