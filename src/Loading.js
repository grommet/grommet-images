import React from 'react';
import { Box } from 'grommet';
import { InProgress } from 'grommet-icons';

const Loading = () => (
  <Box fill align="center" justify="center" pad="xlarge">
    <Box animation="pulse">
      <InProgress size="large" />
    </Box>
  </Box>
);

export default Loading;
