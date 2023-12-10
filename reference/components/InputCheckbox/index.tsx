import { Checkbox, CheckboxProps } from "@mui/material";
import Images from "config/images";
import { memo } from "react";
import classes from './styles.module.scss'

interface Props extends CheckboxProps {

}

const InputCheckbox = memo((props: Props) => {

  return <Checkbox
    classes={{ root: classes.root }}
    icon={<img src={Images.icCheck} alt="" />}
    checkedIcon={<img src={Images.icCheckActive} alt="" />}
    {...props}
  />
})

export default InputCheckbox