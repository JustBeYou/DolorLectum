import { makeStyles } from '@mui/styles';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import PageTemplate from '../components/PageTemplate';
import ColumnCenteredBox from '../components/ColumnCenteredBox';

const useStyles = makeStyles({
  menuBox: {
    marginTop: 100,
    height: 300,
    justifyContent: 'space-between',
  },
  btn: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    height: 48,
    width: 200,
    padding: '0 30px',
    '&.MuiButton-text': {
      color: 'white',
    },
    '&:hover': {
      background: 'linear-gradient(45deg, #fa466d 20%, #FE6B8B 70%, #FF8E53 95%)',
      '&.MuiButton-text': {
        color: 'black',
      },
    },
  },
});

const HomePage = () => {
  const styles = useStyles();
  return (
    <PageTemplate>
      <Box sx={{ height: 50 }}></Box>
      <Typography align="center" variant="h1">
        Dolor<span style={{ color: '#7ad4f5' }}>Lectum</span>
      </Typography>
      <ColumnCenteredBox className={styles.menuBox}>
        <Button component={Link} to="/move" className={styles.btn}>
          Movement
        </Button>
        <Button component={Link} to="/lamp" className={styles.btn}>
          Lamp
        </Button>
        <Button component={Link} to="/sound" className={styles.btn}>
          Sound System
        </Button>
        <Button component={Link} to="/thermo" className={styles.btn}>
          Thermo System
        </Button>
        <Button component={Link} to="/vacuum" className={styles.btn}>
          Vacuum Cleaner
        </Button>
      </ColumnCenteredBox>
    </PageTemplate>
  );
};

export default HomePage;
