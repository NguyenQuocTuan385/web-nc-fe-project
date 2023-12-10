import { memo } from 'react';
import { Box, Dialog } from '@mui/material';
import classes from './styles.module.scss';
import { Error, Help } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';
import { DialogActionsConfirm } from 'components/common/dialogs/DialogActions';
import Heading3 from 'components/common/text/Heading3';
import ButtonClose from 'components/common/buttons/ButtonClose';
import ListDot from 'components/common/list/ListDot';
import ParagraphBody from 'components/common/text/ParagraphBody';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSmall from 'components/common/text/TextBtnSmall';

interface Props {
    isOpen: boolean,
    onCancel: () => void,
    submitEdit: () => void
}

const PopupWarningWeightQuota = memo((props: Props) => {
    const { isOpen, onCancel, submitEdit } = props;
    const { t } = useTranslation()

    const onSubmit = () => {
        submitEdit()
        onCancel()
    }

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
                    <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="quotas_weight_warning_popup_title">{t('quotas_weight_warning_popup_title')}</Heading3>
                </Box>
                <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel} />
            </DialogTitleConfirm>
            <DialogContentConfirm dividers>
                <ParagraphBody
                    $colorName='--gray-80'
                    translation-key="quotas_weight_warning_popup_subtitle_1"
                    dangerouslySetInnerHTML={{ __html: t('quotas_weight_warning_popup_subtitle_1') }}
                />
                <ParagraphBody
                    mt={4}
                    $colorName='--gray-80'
                    translation-key="quotas_weight_warning_popup_subtitle_2"
                    dangerouslySetInnerHTML={{ __html: t('quotas_weight_warning_popup_subtitle_2') }}
                />
                <ParagraphBody
                    mt={4}
                    $colorName='--gray-80'
                    translation-key="quotas_weight_warning_popup_subtitle_3"
                    dangerouslySetInnerHTML={{ __html: t('quotas_weight_warning_popup_subtitle_3') }}
                />
            </DialogContentConfirm>
            <DialogActionsConfirm>
                <Button
                    width="128px"
                    btnType={BtnType.Outlined}
                    translation-key="quotas_weight_warning_change"
                    children={<TextBtnSmall>{t('quotas_weight_warning_change')}</TextBtnSmall>}
                    onClick={onCancel}
                />
                <Button
                    width="128px"
                    btnType={BtnType.Raised}
                    translation-key="quotas_weight_warning_save"
                    children={<TextBtnSmall>{t('quotas_weight_warning_save')}</TextBtnSmall>}
                    onClick={onSubmit}
                />
            </DialogActionsConfirm>
        </Dialog>
    )
})

export default PopupWarningWeightQuota
