import { memo } from 'react';
import { FormControl, TextareaAutosizeProps, TextareaAutosize } from '@mui/material';
import classes from './styles.module.scss';
import clsx from 'clsx';
import TextTitle from 'components/Inputs/components/TextTitle';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';

interface InputsProps extends TextareaAutosizeProps {
  title?: string,
  titleRequired?: boolean,
  placeholder?: string,
  name: string,
  defaultValue?: string,
  value?: string | number,
  className?: any,
  inputRef?: any,
  errorMessage?: string | null,
  optional?: boolean,
  infor?: string
}
const InputTextareaAutosize = memo((props: InputsProps) => {
  const { title,
    placeholder,
    name,
    defaultValue,
    value,
    className,
    inputRef,
    errorMessage,
    optional,
    infor,
    titleRequired,
    ...rest
  } = props;

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl className={classes.root}>
      <TextTitle invalid={errorMessage}>{title}
      {optional ? <span className={classes.optional}> (optional)</span> : ""}
      {titleRequired ? <span className={classes.titleRequired}> *</span> : ""}
      </TextTitle>
      <TextareaAutosize
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        className={clsx(className, !errorMessage ? classes.inputTextfield : classes.inputInvalid)}
        {...inputProps}
        ref={refInput}
        {...rest}
      />
      {infor && <p className={classes.textInfor}>{infor}</p>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputTextareaAutosize;



