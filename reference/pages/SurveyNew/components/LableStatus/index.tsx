import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { OptionItem } from "models/general";
import { PackType, packTypes } from "models/pack";
import { useTranslation } from "react-i18next";

interface LabelStatusProps {
  status: OptionItem
}

const LabelStatus = memo((props: LabelStatusProps) => {
  
  const { status, ...rest } = props;
  const { t } = useTranslation()

  const getLabel = () => {
    return t(packTypes.find(it => it.id === status.id)?.translation || '')
  }

  return (
    <div
      className={clsx(
        classes.root,
        status.id === PackType.Current_Pack ? classes.green : "",
        status.id === PackType.Test_Pack ? classes.blue : "",
        status.id === PackType.Competitor_Pack ? classes.brown : "",
      )
      }
      {...rest}
    >
      {getLabel()}
    </div >
  );
});
export default LabelStatus;
