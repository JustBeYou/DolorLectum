import { useEffect } from 'react';
import { Box } from '@mui/material';

import PageTemplate from '../components/PageTemplate';

const MovementPage = () => {
  let data = {};

  const fetchData = async () => {
    try {
      data = await fetch('http://lamp:8080/status');
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log({ data });

  return (
    <PageTemplate>
      <Box></Box>
    </PageTemplate>
  );
};

export default MovementPage;
