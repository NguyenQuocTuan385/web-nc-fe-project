import React, { memo } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanelBox = memo((props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <>
      {value === index && children}
    </>
  );
})

export default TabPanelBox;



