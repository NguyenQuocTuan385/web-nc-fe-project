import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormControlProps,
  OutlinedInputProps,
  Box,
  Button,
  Menu,
  MenuItem,
  OutlinedInput,
  Stack,
  IconButton,
  TypographyProps,
} from '@mui/material';
import classes from './styles.module.scss';
import clsx from 'clsx';
import { Check, Close, KeyboardArrowDown } from '@mui/icons-material';
import Heading5 from 'components/common/text/Heading5';
import { Content } from '..';
import { Control, useController } from 'react-hook-form';
import { ECurrency, currencyTypes } from 'models/general';
import ErrorMessage from 'components/common/text/ErrorMessage';

export interface RenderPriceProps {
  price: number;
  currency: ECurrency;
  onEditting: () => any;
}

interface InputsProps extends OutlinedInputProps {
  name?: string;
  control?: Control<any>;
  type?: string;
  placeholder?: string;
  showCurrency?: boolean;
  disableCurrency?: boolean;
  currencyName?: string;
  render?: (renderProps: RenderPriceProps) => any;
  onSave?: (data: any) => any;
  externalOnChangeCurrency?: (currency: ECurrency) => void;
  externalCurrencyValue?: ECurrency;
  viewProps?: TypographyProps;
  rootProps?: FormControlProps;
}

const DashedInputField = memo(
  ({
    name,
    control,
    type,
    placeholder,
    showCurrency,
    disableCurrency,
    rootProps,
    inputProps,
    viewProps,
    currencyName,
    value: externalValue,
    onChange: externalOnChange,
    externalOnChangeCurrency,
    externalCurrencyValue,
    render,
    onSave,
    disabled,
    ...rest
  }: InputsProps) => {
    const [inputState, setInputState] = useState({
      editing: false,
      oldValue: '',
      oldCurrency: ECurrency.VND,
    });

    const [menuCurrencyAnchorEl, setMenuCurrencyAnchorEl] = useState(null);

    const {
      field: { onChange, value, ref },
      fieldState: { error },
    } = control
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useController({ name, control })
      : {
          field: {
            onChange: externalOnChange as (...event: any[]) => void,
            value: externalValue,
            ref: undefined,
          },
          fieldState: {
            error: null,
          },
        };

    const {
      field: { onChange: onChangeCurrency, value: currencyValue },
      fieldState: { error: currencyError },
    } = control // eslint-disable-next-line react-hooks/rules-of-hooks
      ? useController({ name: currencyName, control })
      : {
          field: {
            onChange: externalOnChangeCurrency,
            value: externalCurrencyValue,
          },
          fieldState: { error: null },
        };

    const onEditting = () => {
      if (disabled) return;
      setInputState((prevState) => ({
        ...prevState,
        editing: true,
        oldValue: value,
        oldCurrency: currencyValue,
      }));
    };

    const onEndEditting = () => {
      setInputState((prevState) => ({ ...prevState, editing: false }));
    };

    const onCloseMenuCurrency = () => {
      setMenuCurrencyAnchorEl(null);
    };

    const onOpenMenuCurrency = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disableCurrency) setMenuCurrencyAnchorEl(e.currentTarget);
    };

    const _onSave = () => {
      if (!!error || !!currencyError) return;
      onSave({ [name]: value, [currencyName]: currencyValue });
      onEndEditting();
    };

    const onCancel = () => {
      onChange(inputState.oldValue);
      onChangeCurrency(inputState.oldCurrency);
      onEndEditting();
    };

    const handleChangeCurrency = (id: ECurrency) => {
      onChangeCurrency(id);
      onCloseMenuCurrency();
    };
    const onKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      switch (e.key) {
        case 'Enter':
          return _onSave();
        case 'Escape':
          return onCancel();
      }
    };
    const currencyLabel = useMemo(
      () =>
        currencyTypes.find((currency) => currency.id === currencyValue)?.symbol,
      [currencyValue]
    );

    const CurrencyButton = () => {
      return (
        <Box
          className={clsx(classes.menuCurrencyWrapper, {
            [classes.menuShow]: Boolean(menuCurrencyAnchorEl),
          })}
        >
          <Button
            className={classes.selectCurrencyBtn}
            disableRipple
            variant="text"
            endIcon={!disableCurrency ? <KeyboardArrowDown /> : null}
            onClick={onOpenMenuCurrency}
          >
            {currencyLabel}
          </Button>
          <Menu
            anchorEl={menuCurrencyAnchorEl}
            open={Boolean(menuCurrencyAnchorEl)}
            onClose={onCloseMenuCurrency}
            className={classes.selectCurrencyMenu}
          >
            {currencyTypes.map((item, idx) => (
              <MenuItem
                key={idx}
                className={classes.menuItem}
                onClick={() => handleChangeCurrency(item.id)}
              >
                <Heading5 className={classes.currencySymbol} $fontWeight={400}>
                  {item.symbol}
                </Heading5>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      );
    };

    return (
      <FormControl className={clsx(classes.root)} {...rootProps}>
        {inputState.editing ? (
          <>
            <Stack direction="row" alignItems="center">
              <OutlinedInput
                name={name}
                autoFocus={true}
                autoComplete="off"
                type={type || 'text'}
                placeholder={placeholder}
                value={value ?? ''}
                inputRef={ref}
                notched={false}
                inputProps={{
                  ...inputProps,
                }}
                classes={{ root: classes.dashedInputField }}
                className={clsx({[classes.error]: !!error,})}
                onChange={onChange}
                onWheel={(e) =>
                  e.target instanceof HTMLElement &&
                  (e.target as any).type === 'number' &&
                  e.target.blur()
                }
                endAdornment={showCurrency && CurrencyButton()}
                onKeyDown={onKeyDown}
                {...rest}
              />
              <Stack direction="row" className={classes.actionBtnWrapper}>
                <IconButton
                  className={clsx(classes.actionBtn, classes.saveBtn)}
                  disabled={!!error || !value}
                  onClick={_onSave}
                >
                  <Check />
                </IconButton>
                <IconButton className={classes.actionBtn} onClick={onCancel}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
            {error?.message && (
              <ErrorMessage className={classes.errorMessage}>
                {error?.message}
              </ErrorMessage>
            )}
          </>
        ) : (
          <>
            {render ? (
              render({
                price: value,
                currency: currencyValue,
                onEditting,
              })
            ) : (
              <Content
                $filled={!!value?.length}
                $error={!!error}
                onClick={onEditting}
                {...viewProps}
              >
                {!!value ? value : placeholder}
              </Content>
            )}
          </>
        )}
      </FormControl>
    );
  }
);

export default DashedInputField;
