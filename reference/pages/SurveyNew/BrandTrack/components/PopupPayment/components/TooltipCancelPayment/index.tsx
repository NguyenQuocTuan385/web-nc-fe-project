import React from "react";
import { Box, Tooltip, Grid } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import Heading5 from "components/common/text/Heading5";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import Span from "../Span";

interface PropsType {
  onCancelPayment?: () => void;
}
function TooltipCancelPayment({ onCancelPayment }: PropsType) {
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const { t } = useTranslation();

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        arrow
        classes={{ popper: classes.boxTooltip }}
        placement="top"
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={openTooltip}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <Grid className={classes.boxTooltipTitle}>
            <Heading5 mb={3} $colorName="--gray-02" translation-key="brand_track_popup_paynow_change_payment_method">
              {t("brand_track_popup_paynow_change_payment_method")}
            </Heading5>
            <Box display={"flex"}>
              <Button
                translation-key="brand_track_popup_paynow_tooltip_action_1"
                sx={{ marginRight: "16px" }}
                btnType={BtnType.Secondary}
                width={"150px"}
                children={t("brand_track_popup_paynow_tooltip_action_1")}
                onClick={handleTooltipClose}
              ></Button>
              <Button
                translation-key="brand_track_popup_paynow_tooltip_action_2"
                btnType={BtnType.Primary}
                width={"150px"}
                children={t("brand_track_popup_paynow_tooltip_action_2")}
                onClick={onCancelPayment}
              ></Button>
            </Box>
          </Grid>
        }
      >
        <Span translation-key="brand_track_popup_paynow_action_1" onClick={handleTooltipOpen}>
          {t("brand_track_popup_paynow_action_1")}
        </Span>
      </Tooltip>
    </ClickAwayListener>
  );
}

export default TooltipCancelPayment;
