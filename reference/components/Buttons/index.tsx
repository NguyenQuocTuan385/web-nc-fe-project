import { memo } from "react";
import { Button } from "@mui/material";
import clsx from "clsx";
import classes from './styles.module.scss';

interface ButtonsProps {
  btnType?: "Blue" | "Red" | "TransparentBlue" | "Green";
  children?: any;
  onClick?: (e?: any) => void;
  type?: any;
  disabled?: boolean;
  className?: any;
  width?: string;
  padding?: string;
  nowrap?: boolean;
  [key: string]: any;
}

const Buttons = memo((props: ButtonsProps) => {
  const { width, padding, className, btnType, children, disabled, onClick, nowrap, ...rest } = props;
  return (
    <Button
      className={clsx(
        classes.root,
        btnType === "Blue" && classes.btnBlue,
        btnType === "Red" && classes.btnRed,
        btnType === "TransparentBlue" && classes.btnTransparentBlue,
        btnType === "Green" && classes.btnGreen,
        className
      )}
      classes={{ disabled: classes.btndisabled }}
      type="button"
      {...rest}
      onClick={onClick}
      disabled={disabled}
      sx={{minWidth: width, padding: padding, whiteSpace: nowrap ? "nowrap" : "unset"}}
    >
      {children}
    </Button>
  );
});
export default Buttons;
