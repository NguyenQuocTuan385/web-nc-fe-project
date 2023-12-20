import PropTypes from "prop-types";
import FormTopTab from "./components/FormTopTab";
import { Box, Card, Paper } from "@mui/material";
import classes from "./styles.module.scss";
import AdDetails from "./components/AdvertiseDetails";
import ContractDetailForm from "pages/admin/CreateContractForm/components/ContractDetailForm";
import SidebarManagement from "components/admin/SidebarManagement";
import SideBarWard from "components/admin/SidebarWard";

function ContractForm() {
  return (
    <Box className={classes.pageContainer}>
      <SideBarWard />
      <Box style={{ marginLeft: "320px" }}>
        <AdDetails
          address="227 Nguyễn Văn Cừ, Phường 11, Quận 5 Thành phố Hồ Chí Minh"
          adType="Bảng Pano cột trụ"
          width={2.5}
          height={10}
          quantity={1}
          adForm="Quảng cáo sản phẩm"
          locationType="Đất chợ / Tư nhân / Hành lang an toàn giao thông"
        />
        <ContractDetailForm />
      </Box>
    </Box>
  );
}

export default ContractForm;
