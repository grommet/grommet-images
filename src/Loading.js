import React from 'react';
import { Box } from 'grommet';
import { InProgress } from 'grommet-icons';

const Loading = () => (
  <Box fill align="center" justify="center" pad="xlarge">
    <InProgress size="large" />
  </Box>
);

export default Loading;
