import { memo } from 'react';
import {
  FormControl,
  Box
} from '@mui/material';
import Select, { components, DropdownIndicatorProps, GroupBase, OptionProps, SingleValueProps, StylesConfig } from 'react-select';
import classes from './styles.module.scss';
import { Controller } from 'react-hook-form';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import TextTitle from 'components/common/text/TextTitle';
import ErrorMessage from 'components/common/text/ErrorMessage';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';
import HelpTooltip from "components/common/tooltip/HelpTooltip";

const customStyles = (error?: boolean): StylesConfig<any, boolean, GroupBase<unknown>> => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
   'div': {
    padding: '6px 8px',
   }
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: '0.015em',
    color: 'var(--eerie-black)',
    padding: '14px 15px',
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: state.isSelected || state.isFocused ? 'var(--cimigo-blue-light-4)' : '#FFFFFF',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: 16,
    fontWeight: 400,
    color: state.isFocused ? "var(--cimigo-blue-light-1)" : "var(--gray-90)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "6px 0 6px 16px", 
    'div': {
      paddingBottom: 0,
    }
  }),   
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    fontSize: 16,
    fontWeight: 400,
    alignItems: "center",
  }),
  control: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: state.isDisabled ? "var(--gray-5)" : "#FFFFFF",
    border: state.isFocused ? "1px solid var(--cimigo-blue-light-1)" : "1px solid var(--gray-40)",
    // borderColor:"var(--gray-40)",
    "svg": {
      color: state.isFocused ? "var(--cimigo-blue-light-1)" : "var(--gray-60)",
    },
    "div": {
      color: state.isFocused ? "var(--cimigo-blue-light-1)" : "var(--gray-90)",
    },
    boxShadow: "0",
    "&:hover": {
      border: "1px solid var(--cimigo-blue-light-1)",
    },
    "&:hover svg, &:hover div": {
      color: "var(--cimigo-blue-light-1)"
    },
  })
})

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
    </components.DropdownIndicator>
  );
};

const Option = ({ children, ...props }: OptionProps<any>) => (
  <components.Option {...props}>
    {props.data?.img && <img src={props.data.img} alt="" className={classes.iconOption} />}
    {props.data?.icon && <props.data.icon className={classes.iconPrefix}/>}
    {children}
  </components.Option>
)

const SingleValue = ({ children, ...props }: SingleValueProps<any>) => (
  <components.SingleValue {...props}>
    {props.data?.img && <img src={props.data.img} alt="" className={classes.iconValue} />}
    {props.data?.icon && <props.data.icon className={classes.iconPrefix}/>}
    {children}
  </components.SingleValue>
);

interface InputSelectProps {
  className?: string,
  title?: string,
  name?: string,
  errorMessage?: string | null,
  control?: any,
  bindKey?: string,
  bindLabel?: string,
  selectProps?: StateManagerProps,
  fullWidth?: boolean,
  optional?: boolean,
  toolTipTranslation?: string,
}

const InputSelect = memo((props: InputSelectProps) => {
  const { className, title, errorMessage, name, control, bindKey, bindLabel, selectProps, fullWidth, optional, toolTipTranslation } = props;
  const { t } = useTranslation()

  const getOptionLabel = (option: any) => {
    switch (bindLabel || 'name') {
      case 'translation':
        return t(option["translation"])
      default:
        return option[bindLabel || 'name']
    }
  }

  return (
    <FormControl className={className} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {
        title && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TextTitle invalid={errorMessage}>{title} {optional && <span>({t('common_optional')})</span>}</TextTitle>
              {!!toolTipTranslation && <HelpTooltip translationKey={toolTipTranslation} />}
            </Box>
        )
      }
      {
        control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => <Select
                {...field}
                styles={customStyles(!!errorMessage)}
                getOptionValue={(option) => option[bindKey || 'id']}
                getOptionLabel={(option) => getOptionLabel(option)}
                components={{ DropdownIndicator, Option, SingleValue }}
                {...selectProps}
              />}
            />
          </>
        ) : (
          <>
            <Select
              styles={customStyles(!!errorMessage)}
              getOptionValue={(option) => option[bindKey || 'id']}
              getOptionLabel={(option) => getOptionLabel(option)}
              components={{ DropdownIndicator, Option, SingleValue }}
              {...selectProps}
            />
          </>
        )
      }
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputSelect;



