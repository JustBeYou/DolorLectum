import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

const useStyles = makeStyles({
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: 'brown',
    display: 'flex',
    flexDirection: 'column',
  },
});

const PageTemplate = ({ children }) => {
  const styles = useStyles();
  return <Box className={styles.pageWrapper}>{children}</Box>;
};

export default PageTemplate;
