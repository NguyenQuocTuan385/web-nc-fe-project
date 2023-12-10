import {
  Box,
  Dialog,
  IconButton,
} from '@mui/material';
import Buttons from 'components/Buttons';
import classes from './styles.module.scss';
import Images from 'config/images';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import Heading3 from 'components/common/text/Heading3';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { EPRICE_TEST_TYPE_ID } from 'models';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import images from 'config/images';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';

interface Props {
  typeTitle: EPRICE_TEST_TYPE_ID;
  isOpen: boolean;
  onClose: () => void;
}

const PopupImageInstruction = (props: Props) => {
  const { onClose, isOpen, typeTitle } = props;
  const { t } = useTranslation();
  return (
    <Dialog scroll='paper' open={isOpen} onClose={onClose} classes={{ paper: classes.paper }}>
      {typeTitle === EPRICE_TEST_TYPE_ID.PRODUCT ? (
        <>
          <DialogTitleConfirm>
            <InfoIcon className={classes.infoIcon} />
            <Heading3
              translation-key="price_test_product_image_instruction"
              $colorName='--cimigo-blue-dark-3'
            >
              {t('price_test_product_image_instruction')}
            </Heading3>
            <IconButton className={classes.closeBtn} onClick={onClose}>
              <img src={Images.icClose} alt="" />
            </IconButton>
          </DialogTitleConfirm>
          <DialogContentConfirm dividers>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_product_instruction_1"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_product_instruction_1'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_4"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_4'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_2"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_2'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_3"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_3'),
                }}
              />
            </Box>
            <Box className={classes.imageExampleWrapper}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={images.imgPriceTestProductImageExample}
                  alt="imgPriceTestProductImageExample"
                />
              </Box>
              <ParagraphSmall
                className={classes.imageTitle}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_3"
              >
                {t('price_test_popup_image_product_example_image_title')}
              </ParagraphSmall>
            </Box>
          </DialogContentConfirm>
        </>
      ) : (
        <>
          <DialogTitleConfirm>
            <InfoIcon className={classes.infoIcon} />
            <Heading3
              translation-key="price_test_service_image_instruction"
              $colorName='--cimigo-blue-dark-3'
            >
              {t('price_test_service_image_instruction')}
            </Heading3>
            <IconButton className={classes.closeBtn} onClick={onClose}>
              <img src={Images.icClose} alt="" />
            </IconButton>
          </DialogTitleConfirm>
          <DialogContentConfirm dividers>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_service_instruction_1"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_service_instruction_1'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_4"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_4'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_2"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_2'),
                }}
              />
            </Box>
            <Box className={classes.textInfo}>
              <ParagraphSmall
                className={classes.content}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_instruction_3"
                dangerouslySetInnerHTML={{
                  __html: t('price_test_popup_image_instruction_3'),
                }}
              />
            </Box>
            <Box className={classes.imageExampleWrapper}>
              <Box sx={{ textAlign: 'center' }}>
                <img src={images.imgPriceTestServiceImageExample} alt="imgPriceTestServiceImageExample" />
              </Box>
              <ParagraphSmall
                className={classes.imageTitle}
                $colorName="--eerie-black"
                translation-key="price_test_popup_image_service_example_image_title"
              >
                {t('price_test_popup_image_service_example_image_title')}
              </ParagraphSmall>
            </Box>
          </DialogContentConfirm>
        </>
      )}
    </Dialog>
  );
};
export default PopupImageInstruction;
