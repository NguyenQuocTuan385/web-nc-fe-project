import { FormControl, OutlinedInput, OutlinedInputProps } from "@mui/material";
import TextTitle from "../../text/TextTitle";
import classes from "./styles.module.scss";
import { memo } from "react";
import ErrorMessage from "components/common/text/ErrorMessage";
import clsx from "clsx";
interface InputsProps extends OutlinedInputProps {
  title?: string;
  titleRequired?: boolean;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  value?: string | number;
  inputRef?: any;
  autoComplete?: string;
  errorMessage?: string | null;
  optional?: boolean;
  width?: string;
}

const InputTextfield = memo((props: InputsProps) => {
  const {
    title,
    placeholder,
    name,
    defaultValue,
    value,
    inputRef,
    errorMessage,
    autoComplete,
    width,
  } = props;
  const { ref: refInput, ...inputProps } = inputRef || { ref: null };
  return (
    <>
      <FormControl className={classes.inputContainer}>
        {title && <TextTitle width={width}>{title}</TextTitle>}
        <OutlinedInput
          placeholder={placeholder}
          fullWidth
          size="small"
          name={name}
          classes={{
            root: clsx(classes.inputTextfield, {
              [classes.inputInvalid]: !!errorMessage,
            }),
          }}
          defaultValue={defaultValue}
          value={value}
          autoComplete={autoComplete}
          {...inputProps}
          inputRef={refInput}
        />
      </FormControl>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
});

export default InputTextfield;
