import { Box, Divider, Icon } from "@mui/material";
import React from "react";
import Heading6 from "../../../../../components/common/text/Heading6";
import ParagraphBody from "../../../../../components/common/text/ParagraphBody";
import ParagraphSmall from "../../../../../components/common/text/ParagraphSmall";
import images from "config/images";
import classes from "./style.module.scss";

import clsx from "clsx";

interface advertiseDetailProp {
  adType: string;
  address: string;
  width: number;
  height: number;
  quantity: number;
  adForm: string;
  locationType: string;
}

function AdDetails(adDetail: advertiseDetailProp) {
  return (
    <Box className={clsx(classes.detailContainer)}>
      <Box className={classes.detailGroup}>
        <Heading6 id="general">{adDetail.adType}</Heading6>
        <Heading6 fontWeight={100} $colorName="--gray-20">
          {adDetail.address}
        </Heading6>
      </Box>
      <Divider className={classes.divider} variant="middle" />
      <Box className={classes.detailGroup}>
        <Heading6 id="details">Thông tin chi tiết bảng quảng cáo</Heading6>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 fontWeight={100} $colorName="--gray-20">
              <img src={images.sizeIcon} className={classes.iconItem} />
              Kích thước
            </Heading6>
          </div>
          <ParagraphSmall>
            {adDetail.width}m x {adDetail.height}m
          </ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 fontWeight={100} $colorName="--gray-20">
              <img src={images.quantityIcon} className={classes.iconItem} />
              Số lượng
            </Heading6>
          </div>
          <ParagraphSmall>{adDetail.quantity} trụ / bảng</ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 fontWeight={100} $colorName="--gray-20">
              <img
                src={images.categoryIcon}
                className={clsx(classes.iconItem)}
              />
              Hình thức
            </Heading6>
          </div>
          <ParagraphSmall>{adDetail.adForm}</ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 fontWeight={100} $colorName="--gray-20">
              <img src={images.sortIcon} className={classes.iconItem} />
              Phân loại
            </Heading6>
          </div>
          <ParagraphSmall>{adDetail.locationType}</ParagraphSmall>
        </Box>
      </Box>
      <Divider className={classes.divider} variant="middle" />

      <Box className={classes.detailGroup}>
        <Heading6 id="mapLocation">
          Vị trí đặt bảng quảng cáo trên bản đồ
        </Heading6>
      </Box>
    </Box>
  );
}

export default AdDetails;
