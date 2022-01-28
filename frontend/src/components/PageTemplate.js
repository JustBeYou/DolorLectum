import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

const useStyles = makeStyles({
  pageWrapper: {
    height: '100vh',
    backgroundColor: 'brown',
  },
});

const HomePage = ({ children }) => {
  const styles = useStyles();
  return <Box className={styles.pageWrapper}>{children}</Box>;
};

export default HomePage;
