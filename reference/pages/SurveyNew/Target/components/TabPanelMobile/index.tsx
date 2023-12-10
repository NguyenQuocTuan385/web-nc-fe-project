import { Box, BoxProps } from '@mui/material';
import { memo } from 'react';

interface TabPanelProps extends BoxProps {
  index: any;
  value: any;
}

const TabPanelMobile = memo(({ children, value, index, ...rest }: TabPanelProps) => {

  return (
    <>
      {value === index && (
        <Box {...rest}>{children}</Box>
      )}
    </>
  );
})

export default TabPanelMobile