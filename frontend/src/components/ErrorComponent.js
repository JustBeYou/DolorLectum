import { Typography } from '@mui/material';

const ErrorComponent = ({ error }) => {
  return (
    <Typography sx={{ color: 'red', marginTop: 1 }}>{JSON.stringify(error, null, 2)}</Typography>
  );
};

export default ErrorComponent;
