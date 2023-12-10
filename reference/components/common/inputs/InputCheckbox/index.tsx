import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import clsx from "clsx";
interface Props extends CheckboxProps {
  cleanPadding?: boolean;
  checkboxColorType?: "blue";
}

const InputCheckbox = memo(({ cleanPadding, checkboxColorType, ...rest}: Props) => {
  return <Checkbox
    className={clsx(classes.root, {[classes.cleanPadding]: cleanPadding}, {[classes.blueRoot]: checkboxColorType })}
    icon={<CheckBoxOutlineBlankIcon className={classes.icon} />}
    checkedIcon={<CheckIcon className={classes.checkIcon} fontSize="small" />}
    {...rest}
  />
})

export default InputCheckbox