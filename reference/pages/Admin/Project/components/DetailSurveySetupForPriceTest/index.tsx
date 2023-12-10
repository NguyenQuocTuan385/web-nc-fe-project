import React, { memo, useCallback, useMemo } from 'react';
import classes from "./styles.module.scss"
import { EPaymentPeriodType, PriceTestPicture, paymentPeriodTypes } from 'models/price_test';
import {Project} from "models/project"
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { EPRICE_TEST_TYPE_ID, priceTestTypes } from 'models';
import { useTranslation } from 'react-i18next';
import Heading3 from 'components/common/text/Heading3';
import { AttachmentService } from 'services/attachment';
import { getUrlExtension } from 'utils/image';
import FileSaver from 'file-saver';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { useDispatch } from 'react-redux';
import { fCurrency, fCurrencyVND } from 'utils/formatNumber';
import { ECurrency, currencyTypes } from 'models/general';
import DetailCustomQuestion from '../DetailCustomQuestion';
import { SetupSurveyText } from '..';

export interface PageProps {
  project?: Project;
}

const DetailSurveySetupForPriceTest = memo(({ project }: PageProps) => {
  const { t } = useTranslation();
  
  const dispatch = useDispatch()
  const priceTest = useMemo(() => project?.priceTest, [project?.priceTest])

  const typeSurvey = useMemo(
    () => priceTestTypes.find((item) => item.id === priceTest?.typeId)?.name,
    [priceTest?.typeId]
  );

  const currencyTitle = useMemo(
    () => currencyTypes.find((item) => item.id === priceTest?.currency)?.subName,
    [priceTest?.currency]
  );

  const paymentPeriodTitle = useMemo(
    () => {
      if(!priceTest?.paymentPeriod) return undefined
      if(priceTest?.paymentPeriod === EPaymentPeriodType.OTHER) return priceTest?.customPaymentPeriod
      return paymentPeriodTypes.find((item) => item.id === priceTest?.paymentPeriod)?.name
    },
    [priceTest?.paymentPeriod, priceTest?.customPaymentPeriod]
  );

  const convertPrice = useCallback(
    (price: number) => {
      if (priceTest?.currency === ECurrency.USD) return fCurrency(price);
      return fCurrencyVND(price);
    },
    [priceTest?.currency]
  );

  const onDownloadPriceTestPicture = (picture: PriceTestPicture) => {
    dispatch(setLoading(true))
    AttachmentService.downloadByUrl(picture.url)
      .then((res) => {
        const ext = getUrlExtension(picture.url)
        FileSaver.saveAs(res.data, `${priceTest?.name || picture.id}.${ext}`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Box>
      <Heading3 $colorName="--eerie-black" sx={{ mb: 2 }}>
        Information:
      </Heading3>
      <Grid container spacing={2} ml={0}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Survey Type: <SetupSurveyText>{t(typeSurvey)}</SetupSurveyText>
          </Typography>
          <Typography variant="subtitle1">
            Name:  <SetupSurveyText $empty={!priceTest?.name}>{priceTest?.name || "None"}</SetupSurveyText>
          </Typography>
          <Typography variant="subtitle1">
            Brand:  <SetupSurveyText $empty={!priceTest?.brand}>{priceTest?.brand || "None"}</SetupSurveyText>
          </Typography>
          {priceTest?.typeId === EPRICE_TEST_TYPE_ID.SERVICE && (
            <Typography variant="subtitle1">
              Provider:  <SetupSurveyText $empty={!priceTest?.provider}>{priceTest?.provider || "None"}</SetupSurveyText>
            </Typography>
          )}
          <Typography variant="subtitle1">
            {priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT ? "Packing: " : "Package name: "}
            <SetupSurveyText $empty={!priceTest?.packing}>{priceTest?.packing || "None"}</SetupSurveyText>
          </Typography>
          <Typography variant="subtitle1">
            Additional information: <SetupSurveyText $empty={!priceTest?.additionInfo}>{priceTest?.additionInfo || "None"}</SetupSurveyText>
          </Typography>
        </Grid>
      </Grid>

      <Heading3 $colorName="--eerie-black" sx={{ mt: 3, mb: 2 }}>
        Pictures:
      </Heading3>
      {!!priceTest?.priceTestPictures?.length ? (
        <Box className={classes.pictureBox}>
        {priceTest?.priceTestPictures?.map(picture => (
          <Tooltip key={picture.id} title={'Download'}>
            <img src={picture.url} alt="" onClick={() => onDownloadPriceTestPicture(picture)} />
          </Tooltip>
        ))}
      </Box>
      ) : <Typography ml={2} variant="subtitle1">Empty</Typography>}

      <Heading3 $colorName="--eerie-black" sx={{ mt: 4, mb: 2 }}>
        Price Setup:
      </Heading3>
      <Grid container spacing={2} ml={0}>
        <Grid item xs={12} >
          <Typography variant="subtitle1">
            Currency type:  <SetupSurveyText>{currencyTitle}</SetupSurveyText>
          </Typography>
          <Typography variant="subtitle1">
            Estimate price:  <SetupSurveyText $empty={!priceTest?.estimatePrice}>{priceTest?.estimatePrice ? convertPrice(priceTest?.estimatePrice) : "None"}</SetupSurveyText>
          </Typography>
          <Typography variant="subtitle1">
            Step price:  <SetupSurveyText $empty={!priceTest?.stepPrice}>{priceTest?.stepPrice ? convertPrice(priceTest?.stepPrice) : "None"}</SetupSurveyText>
          </Typography>
          {priceTest?.typeId === EPRICE_TEST_TYPE_ID.SERVICE && (
            <Typography variant="subtitle1">
              Payment Period:  <SetupSurveyText $empty={!priceTest?.paymentPeriod}>{t(paymentPeriodTitle) || "None"}</SetupSurveyText>
            </Typography>
          )}
        </Grid>
      </Grid>
      <DetailCustomQuestion project={project}/>
    </Box>
  );
});
export default DetailSurveySetupForPriceTest;
