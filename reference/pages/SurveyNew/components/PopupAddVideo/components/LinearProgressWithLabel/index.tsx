import {
    Box,
    LinearProgress,
    LinearProgressProps,
  } from "@mui/material";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import classes from "./styles.module.scss";

export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
        <Box sx={{ width: '100%', margin: "6px 0" }}>
          <LinearProgress variant="determinate" {...props} className={classes.progress}/>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <ParagraphExtraSmall $colorName="--cimigo-blue-light-1">{`Uploading...${Math.round(
            props.value,
          )}%`}</ParagraphExtraSmall>
        </Box>
      </Box>
    );
  }