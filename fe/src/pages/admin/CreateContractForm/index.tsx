import PropTypes from "prop-types";
import FormTopTab from "./components/FormTopTab";
import { Box, Card, Paper } from "@mui/material";
import classes from "./styles.module.scss";
import AdDetails from "./components/AdvertiseDetails";
import ContractDetailForm from "pages/admin/CreateContractForm/components/ContractDetailForm";

function ContractForm() {
  return (
    <Box className={classes.pageContainer}>
      <h1>Tạo cấp phép mới</h1>
      <FormTopTab />
      <Card>
        <AdDetails />
      </Card>
      <ContractDetailForm />
    </Box>
  );
}

export default ContractForm;
