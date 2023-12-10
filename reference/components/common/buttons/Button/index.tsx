import { memo } from "react";
import { Button as ButtonMUI, ButtonProps as ButtonPropsMUI } from "@mui/material";
import clsx from "clsx";
import classes from './styles.module.scss';

export enum BtnType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Outlined = 'Outlined',
  Text = 'Text',
  Raised ='Raised'
}

interface ButtonProps extends ButtonPropsMUI {
  btnType?: BtnType;
  width?: string;
  padding?: string;
  nowrap?: boolean;
}

const Button = memo((props: ButtonProps) => {
  const { width, padding, className, btnType, children, nowrap, sx = {}, ...rest } = props;
  return (
    <ButtonMUI
      className={clsx(
        classes.root,
        {
          [classes.btnPrimary]: btnType === BtnType.Primary,
          [classes.btnSecondary]: btnType === BtnType.Secondary,
          [classes.btnOutlined]: btnType === BtnType.Outlined,
          [classes.btnText]: btnType === BtnType.Text,
          [classes.btnRaised]: btnType === BtnType.Raised,  
        },
        className
      )}
      type="button"
      {...rest}
      sx={{...sx, minWidth: width, padding: padding, whiteSpace: nowrap ? "nowrap" : "unset"}}
    >
      {children}
    </ButtonMUI>
  );
});
export default Button;