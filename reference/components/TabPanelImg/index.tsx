import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanelImg(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(28, 28, 28, 0.2)",
            padding: "36px 80px",
            maxWidth: 942,
            borderRadius: value === 0 ? "0px 4px 4px 4px" : value === 1 ? "4px" : "4px 0px 4px 4px"
          }}
        >
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
export default TabPanelImg;



