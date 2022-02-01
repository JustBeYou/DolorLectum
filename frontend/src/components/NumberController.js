import { Stack, Button, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  labelContainer: {
    display: 'inline-block',
    width: 20,
  },
  labelText: {
    textAlign: 'center',
  },
  button: {
    borderRadius: '20em',
  },
});

const NumberController = ({ label, increment, decrement }) => {
  const styles = useStyles();
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="contained" onClick={decrement} className={styles.button}>
        -
      </Button>
      <Box className={styles.labelContainer}>
        <Typography className={styles.labelText}>{label}</Typography>
      </Box>
      <Button variant="contained" onClick={increment} className={styles.button}>
        +
      </Button>
    </Stack>
  );
};

export default NumberController;
