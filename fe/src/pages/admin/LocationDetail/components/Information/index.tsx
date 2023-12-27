import React from "react";
import { Box, Container, Grid } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import classes from "./styles.module.scss";
import { red } from "@mui/material/colors";
import AdvertiseTable from "../AdvertiseTable";
import { Image } from "@mui/icons-material";

export default function Information() {
  return (
    <Box className={classes.boxContainer}>
      <Container>
        <Box className={classes.boxButton}>
          <button className={classes.button}>Quay lại</button>
        </Box>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={6}>
            <Heading6>Thông tin Địa điểm</Heading6>
            <img src='https://picsum.photos/450/200' />
            <p>
              <span className={classes.span}>Địa chỉ:</span> 123 Nguyễn Trãi, P.7, Q.5, TP.HCM
            </p>
            <p>
              <span className={classes.span}>Loại vị trí:</span> Đường phố
            </p>
            <p>
              <span className={classes.span}>Loại hình:</span> Cổ động chính trị
            </p>
            <p>
              <span className={classes.span}>Đã được duyệt:</span> Có
            </p>
          </Grid>
          <Grid item xs={6}>
            {/* <Heading6>Vị trí</Heading6> */}
            <img src='https://picsum.photos/500/300' />
          </Grid>
          <Grid item xs={12} className={classes.gridContainer}>
            <AdvertiseTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
