import { memo } from 'react';
import {
  FormControl
} from '@mui/material';
import { components, DropdownIndicatorProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import classes from './styles.module.scss';
import icCaretDown from 'assets/img/icon/ic-caret-down-grey.svg'
import { Controller } from 'react-hook-form';
import TextTitle from 'components/Inputs/components/TextTitle';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';

const customStyles = (error?: boolean) => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    fontStyle: 400,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '140%',
    letterSpacing: '0.015em',
    color: '#1C1C1C',
    padding: '14px 15px',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 16,
    fontWeight: 400,
    color: error ? '#1C1C1C' : "rgba(28, 28, 28, 0.2)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "9.25px 13px"
  }),
  control: (provided: any) => ({
    ...provided,
    background: error ? 'rgba(175, 28, 16, 0.08)' : '#ffffff',
    borderColor: error ? '#af1c10' : 'rgba(28, 28, 28, 0.2)',
  })
})

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={icCaretDown} alt="" />
    </components.DropdownIndicator>
  );
};

interface InputSelectProps {
  title?: string,
  name?: string,
  errorMessage?: string | null,
  control?: any,
  bindKey?: string,
  bindLabel?: string,
  selectProps?: any,
  fullWidth?: boolean,
  optional?: boolean,
  email?: boolean,
  creatable?: boolean
}

const InputCreatableSelect = memo((props: InputSelectProps) => {
  const { title, errorMessage, name, control, bindKey, bindLabel, selectProps, fullWidth, optional, email, creatable = true } = props;

  const validateEmail = (val: string) => {
    return (val || '')
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  
  const isValidNewOption = (inputValue: string, value: any[], _: any[], accessors: { getOptionValue: (option: any) => string, getOptionLabel: (option: any) => string }) => {
    if (!creatable) return false
    const existed = value.find(it => accessors.getOptionValue(it) === inputValue.trim())
    if (email) return validateEmail(inputValue) && !existed && inputValue
    return !existed && inputValue
  }

  const getNewOptionData = (inputValue: string, _: any) => {
    return {
      [bindKey || 'id']: inputValue,
      [bindLabel || 'name']: inputValue,
    }
  }

  return (
    <FormControl classes={{ root: classes.container }} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {title && <TextTitle invalid={errorMessage}>{title} {optional && <span className={classes.optional}>(optional)</span>}</TextTitle>}
      {
        control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => <CreatableSelect
                {...field}
                styles={customStyles(!!errorMessage)}
                getOptionValue={(option: any) => option[bindKey || 'id']}
                getOptionLabel={(option: any) => option[bindLabel || 'name']}
                isValidNewOption={isValidNewOption}
                getNewOptionData={getNewOptionData}
                components={{ DropdownIndicator }}
                {...selectProps}
              />}
            />
          </>
        ) : (
          <>
            <CreatableSelect
              styles={customStyles(!!errorMessage)}
              getOptionValue={(option: any) => option[bindKey || 'id']}
              getOptionLabel={(option: any) => option[bindLabel || 'name']}
              isValidNewOption={isValidNewOption}
              getNewOptionData={getNewOptionData}
              components={{ DropdownIndicator }}
              {...selectProps}
            />
          </>
        )
      }
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputCreatableSelect;



