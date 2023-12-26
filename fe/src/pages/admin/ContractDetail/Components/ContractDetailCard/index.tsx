import { Box, Card, Divider, Icon } from "@mui/material";
import React from "react";
import Heading6 from "../../../../../components/common/text/Heading6";
import ParagraphBody from "../../../../../components/common/text/ParagraphBody";
import ParagraphSmall from "../../../../../components/common/text/ParagraphSmall";
import images from "config/images";
import classes from "./styles.module.scss";

import clsx from "clsx";
import { Contract } from "models/contract";

interface DataListObjectItem {
  imageIcon: any;
  title: string;
  content: string;
}

interface DataProps {
  data: DataListObjectItem[];
  heading: string;
}

function DetailCard(dataList: DataProps) {
  return (
    <Box className={clsx(classes.detailContainer)}>
      <Box className={classes.detailGroup}>
        <Heading6 id='details'>{dataList.heading}</Heading6>

        {dataList.data.map((dataItem: DataListObjectItem) => (
          <Box className={classes.detailItem} key={dataItem.title}>
            <div>
              <Heading6 fontWeight={100}>
                <img src={dataItem.imageIcon} className={classes.iconItem} alt='icon' />
                {dataItem.title}
              </Heading6>
            </div>
            <Heading6 fontWeight={800}>{dataItem.content}</Heading6>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default DetailCard;
