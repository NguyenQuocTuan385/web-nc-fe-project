import { Dialog, Grid, IconButton } from "@mui/material";
import Buttons from "components/Buttons";
import classes from "./styles.module.scss";
import Images from "config/images";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onYes: () => void;
  onClose: () => void;
}

const PopupConfirmInvoiceInfo = (props: Props) => {
  const { t } = useTranslation();
  const { isOpen, onYes, onClose } = props;

  return (
    <Dialog open={isOpen} classes={{ paper: classes.paper }} onClose={onClose}>
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onClose} className={classes.shadowIcClose}>
            <img src={Images.icClose} alt="" />
          </IconButton>
        </Grid>
        <Grid className={classes.title}>
          <span translation-key="payment_billing_sub_tab_payment_skip_info_title">{t("payment_billing_sub_tab_payment_skip_info_title")}</span>
          <p translation-key="payment_billing_sub_tab_payment_skip_info_sub">
            {t("payment_billing_sub_tab_payment_skip_info_sub")}
          </p>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons
            children={t("payment_billing_sub_tab_payment_skip_info_yes")}
            translation-key="payment_billing_sub_tab_payment_skip_info_yes"
            btnType="TransparentBlue"
            padding="12px 16px 12px 16px"
            onClick={onYes}
          />
          <Buttons
            children={t("payment_billing_sub_tab_payment_skip_info_no")}
            translation-key="payment_billing_sub_tab_payment_skip_info_no"
            btnType="Red"
            padding="12px 34px 12px 34px"
            onClick={onClose}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PopupConfirmInvoiceInfo;
