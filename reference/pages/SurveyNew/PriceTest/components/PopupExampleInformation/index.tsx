import { Dialog, IconButton, Stack, Grid, Box } from '@mui/material';
import { memo } from 'react';
import classes from './styles.module.scss';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import Heading3 from 'components/common/text/Heading3';
import Close from '@mui/icons-material/Close';
import Quote from 'components/icons/IconQuote';
import clsx from 'clsx';
import ParagraphBody from 'components/common/text/ParagraphBody';
import Heading5 from 'components/common/text/Heading5';
import { useTranslation } from 'react-i18next';
import {DialogTitleConfirm} from 'components/common/dialogs/DialogTitle';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}
const PopupExampleInformation = memo(({ open, onClose }: DialogProps) => {
  const _onClose = () => {
    onClose();
  };
  const { t } = useTranslation();
  return (
    <Dialog
      scroll="paper"
      classes={{ paper: classes.paper }}
      open={open}
      onClose={_onClose}
      PaperProps={{ sx: { borderRadius: '8px' } }}
    >
      <DialogTitleConfirm>
        <EmojiObjectsOutlinedIcon className={classes.lightBulb} />
        <Heading3
          $colorName="--cimigo-blue-dark-3"
          sx={{ flex: 1 }}
          translation-key="price_test_example_title"
        >
          {t('price_test_example_title')}
        </Heading3>
        <IconButton className={classes.closeBtn} onClick={_onClose}>
          <Close />
        </IconButton>
      </DialogTitleConfirm>
      <DialogContentConfirm $padding='0 24px 24px'>
        <Stack direction="row" spacing={1} sx={{ px: 2 }}>
          <Box>
            <Quote className={clsx(classes.quoteIcon, classes.flip)} />
          </Box>
          <Box className={classes.contentWrapper}>
            <ParagraphBody
              sx={{ mb: 2 }}
              className={classes.content}
              $colorName="--eerie-black"
              translation-key="price_test_example_description_modal"
              dangerouslySetInnerHTML={{
                __html: t('price_test_example_description_modal'),
              }}
            ></ParagraphBody>
            <Heading5 $fontWeight={600} className={classes.content}>
              {t('price_test_example_additional_info_title')}
            </Heading5>
            <ParagraphBody
              $colorName="--eerie-black"
              className={classes.content}
              translation-key="price_test_example_additional_information_modal"
            >
              {t('price_test_example_additional_information_modal')}
            </ParagraphBody>
          </Box>
          <Box className={classes.endQuoteWrapper}>
            <Quote className={classes.quoteIcon} />
          </Box>
        </Stack>
      </DialogContentConfirm>
    </Dialog>
  );
});
export default PopupExampleInformation;
