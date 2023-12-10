import { memo, useEffect, useState } from 'react';
import {
  OutlinedInput,
  FormControl,
  FormControlProps,
  OutlinedInputProps,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import classes from './styles.module.scss';
import clsx from 'clsx';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { Control, useController } from 'react-hook-form';
import { Check, Close } from '@mui/icons-material';
import ErrorMessage from 'components/common/text/ErrorMessage';

interface InputsProps extends OutlinedInputProps {
  control?: Control<any>;
  maxLength?: number;
  placeholder?: string;
  name?: string;
  onCancel?: () => any;
}

const TextareaField = memo((props: InputsProps) => {
  const {
    control,
    maxLength,
    placeholder,
    name,
    value: externalValue,
    onChange: externalOnChange,
    onCancel,
    ...rest
  } = props;

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

  return (
    <FormControl className={classes.root}>
      <OutlinedInput
        minRows={4}
        type={'text'}
        placeholder={placeholder}
        name={name}
        value={value ?? ''}
        multiline
        className={classes.textAreaField}
        autoComplete="off"
        inputRef={ref}
        inputProps={{ maxLength: maxLength }}
        onChange={(e) => {
          if (control) externalOnChange?.(e);
          onChange(e);
        }}
        {...rest}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <ParagraphSmall>
            {value?.length ?? 0}/{maxLength}
          </ParagraphSmall>
        </Box>
        <Stack direction="row" className={classes.actionBtnWrapper}>
          <IconButton
            className={clsx(classes.actionBtn, classes.saveBtn)}
            disabled={!!error}
            type="submit"
          >
            <Check />
          </IconButton>
          <IconButton className={classes.actionBtn} onClick={onCancel}>
            <Close />
          </IconButton>
        </Stack>
      </Stack>
      {error?.message && <ErrorMessage>{error.message}</ErrorMessage>}
    </FormControl>
  );
});
export default TextareaField;
