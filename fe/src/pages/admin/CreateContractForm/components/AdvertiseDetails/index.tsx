import { Box, Divider, Icon } from "@mui/material";
import React from "react";
import Heading6 from "../../../../../components/common/text/Heading6";
import classes from "./style.module.scss";
import ParagraphBody from "../../../../../components/common/text/ParagraphBody";
import ParagraphSmall from "../../../../../components/common/text/ParagraphSmall";

interface advertiseDetailProp {}

function AdDetails(adDetail: advertiseDetailProp) {
  return (
    <Box className={classes.detailContainer}>
      <Box className={classes.detailGroup}>
        <Heading6>Bảng Pano Cột Trụ</Heading6>
        <Heading6 className={classes.lowOpacity}>
          227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh
        </Heading6>
      </Box>
      <Divider className={classes.divider} variant="middle" />
      <Box className={classes.detailGroup}>
        <Heading6>Thông tin chi tiết bảng quảng cáo</Heading6>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 className={classes.lowOpacity}>
              <Icon />
              Kích thước
            </Heading6>
          </div>
          <ParagraphSmall>2.5m x 10m</ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 className={classes.lowOpacity}>
              <Icon />
              Số lượng
            </Heading6>
          </div>
          <ParagraphSmall>1 trụ / bảng</ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 className={classes.lowOpacity}>
              <Icon />
              Hình thức
            </Heading6>
          </div>
          <ParagraphSmall>Quảng cáo sản phẩm</ParagraphSmall>
        </Box>
        <Box className={classes.detailItem}>
          <div>
            <Heading6 className={classes.lowOpacity}>
              <Icon />
              Phân loại
            </Heading6>
          </div>
          <ParagraphSmall>
            Đất công / công viên / Hành lang an toàn giao thông
          </ParagraphSmall>
        </Box>
      </Box>
      <Divider className={classes.divider} variant="middle" />

      <Box className={classes.detailGroup}>
        <Heading6>Vị trí đặt bảng quảng cáo trên bản đồ</Heading6>
      </Box>
    </Box>
  );
}

export default AdDetails;
