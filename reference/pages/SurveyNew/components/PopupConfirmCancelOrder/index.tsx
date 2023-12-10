import { Help } from "@mui/icons-material"
import { Box, Dialog } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import ButtonClose from "components/common/buttons/ButtonClose"
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions"
import { DialogContentConfirm } from "components/common/dialogs/DialogContent"
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle"
import Heading3 from "components/common/text/Heading3"
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import classes from "./styles.module.scss"

interface PopupConfirmCancelOrderProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
}

const PopupConfirmCancelOrder = memo(({ isOpen, onClose, onConfirm }: PopupConfirmCancelOrderProps) => {

  const { t } = useTranslation()

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <Help sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }} />
          <Heading3 $colorName='--gray-90' translation-key="common_popup_cancel_payment_title">{t("common_popup_cancel_payment_title")}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onClose} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-90' translation-key="common_popup_cancel_payment_sub">
          {t("common_popup_cancel_payment_sub")}
        </ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Secondary}
          onClick={onClose}
          translation-key="common_cancel"
          children={<TextBtnSmall translation-key="common_dont_cancel">{t("common_dont_cancel")}</TextBtnSmall>}
        />
        <Button
          btnType={BtnType.Raised}
          translation-key=""
          children={<TextBtnSmall translation-key="common_cancel_this_payment">{t("common_cancel_this_payment")}</TextBtnSmall>}
          onClick={onConfirm}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
})

export default PopupConfirmCancelOrder