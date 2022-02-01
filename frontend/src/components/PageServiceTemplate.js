import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';

import PageTemplate from './PageTemplate';
import ColumnCenteredBox from './ColumnCenteredBox';

const MARGIN_OFFSET = 40;

const useStyles = makeStyles({
  contentContainerWrapper: {
    marginTop: MARGIN_OFFSET,
    marginRight: MARGIN_OFFSET,
    marginLeft: MARGIN_OFFSET,
    flex: 1,
  },
});

const PageServiceTemplate = ({ title, children, sx }) => {
  const styles = useStyles();
  return (
    <PageTemplate>
      <Typography align="center" variant="h2" sx={{ marginTop: 5 }}>
        {title}
      </Typography>
      <ColumnCenteredBox className={styles.contentContainerWrapper}>{children}</ColumnCenteredBox>
    </PageTemplate>
  );
};

export default PageServiceTemplate;
