import { memo } from 'react';
import { Box, Dialog } from '@mui/material';
import classes from './styles.module.scss';
import { Error } from '@mui/icons-material';
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
}

const PopupInvalidQuota = memo((props: Props) => {
    const { isOpen, onCancel } = props;
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
                    <Error sx={{ fontSize: 32, color: "var(--red-error)", mr: 2 }} />
                    <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="quotas_invalid_popup_title">{t('quotas_invalid_popup_title')}</Heading3>
                </Box>
                <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel} />
            </DialogTitleConfirm>
            <DialogContentConfirm dividers>
                <ParagraphBody
                    $colorName='--gray-80'
                    translation-key="quotas_invalid_popup_subtitle"
                    dangerouslySetInnerHTML={{ __html: t('quotas_invalid_popup_subtitle') }}
                />
                <ListDot mt={4} component="ul">
                    <ParagraphBody
                        variant="body2"
                        variantMapping={{ body2: "li" }}
                        $colorName='--gray-80'
                        translation-key="quotas_invalid_popup_requirement_2"
                        dangerouslySetInnerHTML={{ __html: t('quotas_invalid_popup_requirement_2') }}
                    >
                    </ParagraphBody>
                </ListDot>
            </DialogContentConfirm>
            <DialogActionsConfirm>
                <Button
                    width="128px"
                    btnType={BtnType.Raised}
                    translation-key="common_ok"
                    children={<TextBtnSmall>{t('common_ok')}</TextBtnSmall>}
                    onClick={onCancel}
                />
            </DialogActionsConfirm>
        </Dialog>
    )
})

export default PopupInvalidQuota
