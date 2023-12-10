import React, { memo } from 'react';
import { OutlinedInput, FormControl, InputAdornment, OutlinedInputProps } from '@mui/material';
import Images from 'config/images';
import classes from './styles.module.scss';

interface InputSearchProps extends OutlinedInputProps {
  type?: string,
  placeholder?: string,
  name?: string,
  defaultValue?: string,
  value?: string,
  disabled?: boolean,
  className?: any,
  inputRef?: any,
  autoComplete?: string,
  width?: string,
}
const InputSearch = memo(React.forwardRef((props: InputSearchProps, ref) => {
  const {
    type,
    placeholder,
    name,
    defaultValue,
    value,
    disabled,
    className,
    inputRef,
    autoComplete,
    width,
    ...rest
  } = props;

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl sx={{ width: width }}>
      <OutlinedInput
        type='text'
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        name={name}
        fullWidth
        defaultValue={defaultValue}
        value={value}
        classes={{ root: classes.rootTextField, input: classes.inputTextfield }}
        autoComplete={autoComplete}
        endAdornment={
          <InputAdornment position="end">
            <img src={Images.icSearch} alt="eye-close" />
          </InputAdornment>
        }
        {...inputProps}
        inputRef={refInput}
        {...rest}
      />
    </FormControl>
  );
}));
export default InputSearch;



