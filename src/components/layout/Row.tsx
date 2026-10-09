import React from 'react';
import { Box, BoxProps } from './Box';

export function Row(props: BoxProps) {
  return <Box direction="row" align="center" {...props} />;
}
