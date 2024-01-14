import { Box } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";

import clsx from "clsx";
import Heading6 from "components/common/text/Heading6";

interface Prop {
  imageSrc: string;
}

function ShowContractImage(propData: Prop) {
  return (
    <Box className={clsx(classes.detailContainer)}>
      <Box className={classes.detailGroup}>
        <Heading6>Hình ảnh bảng quảng cáo</Heading6>

        <Box className={classes.detailItem}>
          <div>
            <Heading6 fontWeight={100}>
              <img src={propData.imageSrc} className={classes.iconItem} alt='icon' />
            </Heading6>
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default ShowContractImage;
