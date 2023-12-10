import { Box, Grid } from '@mui/material';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { useTranslation } from 'react-i18next';
import classes from './styles.module.scss';
import { EPRICE_TEST_TYPE_ID, priceTestTypes } from 'models';
import clsx from 'clsx';

interface PriceTestTypeBoxProps {
  disabled?: boolean;
  value: EPRICE_TEST_TYPE_ID;
  onChangeType: (id: EPRICE_TEST_TYPE_ID) => void;
}
export const PriceTestTypeBox = ({
  disabled,
  value,
  onChangeType,
}: PriceTestTypeBoxProps) => {
  const { t } = useTranslation();
  return (
    <Grid container direction="row" className={classes.content}>
      {priceTestTypes.map((item, _) => (
        <Box
          key={item.id}
          onClick={() => onChangeType(item.id)}
          className={clsx(classes.tabTypePriceTest, {
            [classes.tabActive]: value === item.id,
            [classes.disabled]: value !== item.id && disabled,
          })}
        >
          <img src={item.img} alt="Tab Type Price Test" />
          <ParagraphBody
            $fontWeight="500"
            $colorName="--eerie-black"
            letterSpacing="0.15px"
            translation-key={item.name}
          >
            {t(item.name)}
          </ParagraphBody>
        </Box>
      ))}
    </Grid>
  );
};
