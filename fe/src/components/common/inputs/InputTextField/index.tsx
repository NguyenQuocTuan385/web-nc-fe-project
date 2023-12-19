import { FormControl, OutlinedInput, OutlinedInputProps } from "@mui/material";
import TextTitle from "../../text/TextTitle";
import classes from "./styles.module.scss";
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
}

const InputTextfield = (props: InputsProps) => {
  const {
    title,
    placeholder,
    name,
    defaultValue,
    value,
    inputRef,
    errorMessage,
    autoComplete,
    optional,
    titleRequired,
  } = props;

  return (
    <FormControl className={classes.inputContainer}>
      {title && (
        <TextTitle invalid={errorMessage} width={"220px"}>
          {title}
          {optional ? (
            <span className={classes.optional}>Không bắt buộc</span>
          ) : (
            ""
          )}
          {titleRequired ? (
            <span className={classes.titleRequired}> *</span>
          ) : (
            ""
          )}
        </TextTitle>
      )}
      <OutlinedInput
        placeholder={placeholder}
        fullWidth
        size="small"
        name={name}
        defaultValue={defaultValue}
        value={value}
        autoComplete={autoComplete}
        inputRef={inputRef}
      />
    </FormControl>
  );
};

export default InputTextfield;
