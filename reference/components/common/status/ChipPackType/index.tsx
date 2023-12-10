import { Chip, ChipProps } from "@mui/material";
import clsx from "clsx";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { PackType, packTypes } from "models/pack";
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next";
import classes from './styles.module.scss';

interface ChipPackTypeProps extends ChipProps {
  status: number
}

export const ChipPackType = memo(({ status, className, ...rest }: ChipPackTypeProps) => {

  const { t } = useTranslation()

  const statusLabel = useMemo(() => {
    return t(packTypes.find(it => it.id === status)?.translation || '')
  }, [status]);

  return (
    <Chip
      label={<ParagraphExtraSmall>{statusLabel}</ParagraphExtraSmall>}
      {...rest}
      className={clsx(
        classes.root,
        className,
        {
          [classes.current]: PackType.Current_Pack === status,
          [classes.test]: PackType.Test_Pack === status,
          [classes.competitor]: PackType.Competitor_Pack === status,
        }
      )}
    />
  )
})

export default ChipPackType