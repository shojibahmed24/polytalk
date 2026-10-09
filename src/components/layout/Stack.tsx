import React from 'react';
import { Box, BoxProps } from './Box';

export function Stack(props: BoxProps) {
  return <Box direction="column" {...props} />;
}
