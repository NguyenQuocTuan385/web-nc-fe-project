import { Box, Card, Divider, Icon } from "@mui/material";
import React from "react";
import Heading6 from "../../../../../components/common/text/Heading6";
import ParagraphBody from "../../../../../components/common/text/ParagraphBody";
import ParagraphSmall from "../../../../../components/common/text/ParagraphSmall";
import images from "config/images";
import classes from "./style.module.scss";

import clsx from "clsx";
import FormTopTab from "../FormTopTab";
import { Location } from "models/location";
import MapAdsManagementAdmin from "pages/admin/MapAdsManagement";

interface advertiseDetailProp {
  adType?: string;
  width?: number;
  height?: number;
  quantity?: number;
  location?: Location;
}

function AdDetails(adDetail: advertiseDetailProp) {
  return (
    <Card>
      <Box className={classes.topGroup}>
        <h1>Tạo cấp phép mới</h1>
        <FormTopTab />
      </Box>

      <Box className={clsx(classes.detailContainer)}>
        <Box className={classes.detailGroup}>
          <Heading6 id='general' fontSize={"20px"} fontWeight={500}>
            {adDetail.adType}
          </Heading6>
          <Heading6 fontWeight={50}>{adDetail.location?.address}</Heading6>
        </Box>
        <Divider className={classes.divider} variant='middle' />
        <Box className={classes.detailGroup}>
          <Heading6 id='details'>Thông tin chi tiết bảng quảng cáo</Heading6>
          <Box className={classes.detailItem}>
            <div>
              <Heading6 fontWeight={100}>
                <img src={images.sizeIcon} className={classes.iconItem} />
                Kích thước
              </Heading6>
            </div>
            <Heading6 fontWeight={800}>
              {adDetail.width}m x {adDetail.height}m
            </Heading6>
          </Box>
          <Box className={classes.detailItem}>
            <div>
              <Heading6 fontWeight={100}>
                <img src={images.quantityIcon} className={classes.iconItem} />
                Số lượng
              </Heading6>
            </div>
            <Heading6 fontWeight={800}>{adDetail.quantity} trụ / bảng</Heading6>
          </Box>
          <Box className={classes.detailItem}>
            <div>
              <Heading6 fontWeight={100}>
                <img src={images.categoryIcon} className={clsx(classes.iconItem)} />
                Hình thức
              </Heading6>
            </div>
            <Heading6 fontWeight={800}>{adDetail.location?.adsForm.name}</Heading6>
          </Box>
          <Box className={classes.detailItem}>
            <div>
              <Heading6 fontWeight={100}>
                <img src={images.sortIcon} className={classes.iconItem} />
                Phân loại
              </Heading6>
            </div>
            <Heading6 fontWeight={800}>{adDetail.location?.locationType.name}</Heading6>
          </Box>
        </Box>
        <Divider className={classes.divider} variant='middle' />

        {adDetail.location && (
          <Box className={classes.detailGroup}>
            <Heading6 id='mapLocation'>Vị trí đặt bảng quảng cáo trên bản đồ</Heading6>
            <Box className={classes["map-item"]}>
              <MapAdsManagementAdmin locationView={adDetail.location} />
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default AdDetails;
