import { Box, Button, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import { Header } from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import reportDetail from "./report-detail.json";

const BoxFlex = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const ReportDetail = () => {
  return (
    <Box>
      <Header />
      <div className={classes["report-detail-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <Button>
            <IconButton size="medium">
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButton>
            Trở về
          </Button>
          <Box>
            <h3>Hình ảnh báo cáo</h3>
            <BoxFlex justifyContent={"space-between"}>
              { reportDetail.images.length > 0 && reportDetail.images.map((image: string) => {
                return <img width={"48%"} height={"250px"} className={ classes['image'] } src={image} alt="Hình ảnh bảng QC"/>
              }) }
            </BoxFlex>
          </Box>
          <Box>
            <h3>Thông tin báo cáo</h3>
            <BoxFlex>
              <Box>

              </Box>
              <Box>
                
              </Box>
            </BoxFlex>
          </Box>
        </Box>
      </div>
    </Box>
  );
};
