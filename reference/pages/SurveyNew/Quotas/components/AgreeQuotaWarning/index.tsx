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

interface AgreeQuotaWarningProps {
  isOpen: boolean,
  onCancel: () => void,
  onConfirm: () => void
}

const AgreeQuotaWarning = memo(({ isOpen, onCancel, onConfirm }: AgreeQuotaWarningProps) => {

  const { t } = useTranslation()

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <Help sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }} />
          <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="quotas_agree_quota_warning_title">{t("quotas_agree_quota_warning_title")}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          $colorName='--gray-80'
          translation-key="quotas_agree_quota_warning_content"
        >
          {t("quotas_agree_quota_warning_content")}
        </ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Secondary}
          onClick={onCancel}
          translation-key="common_cancel"
          children={<TextBtnSmall>{t("common_cancel")}</TextBtnSmall>}
        />
        <Button
          btnType={BtnType.Raised}
          translation-key=""
          children={<TextBtnSmall translation-key="common_ok_i_agree">{t("common_ok_i_agree")}</TextBtnSmall>}
          onClick={onConfirm}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
})

export default AgreeQuotaWarning