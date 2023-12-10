import {
  Box,
  Step,
  StepConnector,
  Stepper,
  StepperProps,
  Tooltip,
} from '@mui/material';
import { memo, useCallback, useMemo } from 'react';
import classes from './styles.module.scss';
import { PriceStepLabel } from '..';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { fCurrency, fCurrencyVND } from 'utils/formatNumber';
import { ECurrency } from 'models/general';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Project } from 'models/project';
import ProjectHelper from 'helpers/project';

interface PriceStepProps extends StepperProps {
  project: Project;
}

interface PriceProps {
  value: string;
  title?: string;
  hiddenMobile?: boolean;
  isHead?: boolean;
  isTail?: boolean;
  isMiddle?: boolean;
}

const PriceStepper = memo(({ project }: PriceStepProps) => {
  const { t } = useTranslation();
  const priceTest = useMemo(() => project.priceTest, [project]);
  const stepNum = useMemo(
    () => ProjectHelper.numPriceTestPriceStep(project) || 0,
    [project]
  );

  const estimatePrice = useMemo(() => priceTest.estimatePrice, [priceTest]);

  const priceStep = useMemo(() => priceTest.stepPrice, [priceTest]);

  const currency = useMemo(() => priceTest.currency, [priceTest]);

  const convertPrice = useCallback(
    (price: number) => {
      if (currency === ECurrency.USD) return fCurrency(price);
      return fCurrencyVND(price);
    },
    [currency]
  );

  const listPrices = useMemo(() => {
    const leftStep = Math.min(Math.ceil(estimatePrice / priceStep), stepNum);
    const leftMostPrice = estimatePrice - priceStep * leftStep;

    const leftListPrice: PriceProps[] = Array.from(
      { length: leftStep },
      (_, idx) => ({
        hiddenMobile: idx % 2 !== 0,
        value: convertPrice(Math.max(0, leftMostPrice + idx * priceStep)),
        isHead: idx === 0,
      })
    );

    const middlePrice: PriceProps = {
      value: convertPrice(leftMostPrice + leftStep * priceStep),
      isMiddle: true,
      title: t('price_test_price_estimate_price_tooltip'),
    };

    const rightListPrice: PriceProps[] = Array.from(
      { length: stepNum },
      (_, idx) => ({
        value: convertPrice(leftMostPrice + (idx + 1 + leftStep) * priceStep),
        isTail: idx === stepNum - 1,
      })
    );

    for (var idx = rightListPrice.length - 1; idx >= 0; idx--) {
      if (idx % 2 === rightListPrice.length % 2) {
        rightListPrice[idx] = {
          ...rightListPrice[idx],
          hiddenMobile: true,
        };
      }
    }
    return [...leftListPrice, middlePrice, ...rightListPrice];
  }, [priceTest]);

  return (
    <Stepper
      sx={{ ml: 1 }}
      alternativeLabel
      className={classes.priceStepper}
      connector={<StepConnector classes={{ root: classes.rootConnector }} />}
    >
      {listPrices.map((price, index) => (
        <Tooltip key={index} title={price?.title ?? price?.value}>
          <Step
            className={clsx(classes.priceStep, {
              [classes.hiddenMobile]: price?.hiddenMobile,
            })}
            key={price.value}
          >
            {(price?.isTail || price?.isHead || price?.isMiddle) && (
              <ParagraphSmall
                className={clsx({
                  [classes.headLabel]: price?.isHead,
                  [classes.tailLabel]: price?.isTail,
                  [classes.estimatePriceTag]: price?.isMiddle,
                })}
              >
                {price.value}
              </ParagraphSmall>
            )}
            <PriceStepLabel
              StepIconComponent={Box}
              $isTips={price?.isTail || price?.isHead}
              $isMidpoint={price?.isMiddle}
            />
          </Step>
        </Tooltip>
      ))}
    </Stepper>
  );
});
export default PriceStepper;
