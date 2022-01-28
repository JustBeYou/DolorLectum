import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

import clsx from 'clsx';

const useStyles = makeStyles({
  cls: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ColumnCenteredBox = ({ children, className }) => {
  const styles = useStyles();
  return <Box className={clsx(styles.cls, className)}>{children}</Box>;
};

export default ColumnCenteredBox;
