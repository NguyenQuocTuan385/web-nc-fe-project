import { useController } from "react-hook-form";
import { Chip, TextField, Autocomplete, FormControl } from "@mui/material";
import classes from "./styles.module.scss";
import clsx from "clsx";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "components/Inputs/components/ErrorMessage";
import yup from "config/yup.custom";

interface InputsProps {
  placeholder?: string;
  control: any;
  name: string;
  nameText: string;
  defaultValue?: string;
  className?: any;
  errorMessage?: string | null;
  disabled?: boolean;
}

export const schemaEmail = yup.string().email().businessEmail();

const InputTag = (props: InputsProps) => {
  const {
    name,
    nameText,
    control,
    placeholder,
    className,
    errorMessage,
    disabled,
  } = props;

  const {
    field: { onChange, onBlur, value },
  } = useController({ name, control });

  const {
    field: { onChange: onChangeText, value: valueText },
  } = useController({ name: nameText, control });

  return (
    <FormControl classes={{ root: classes.container }}>
      <Autocomplete
        classes={{
          root: classes.autoComplete,
          clearIndicator: classes.clearIndicator,
        }}
        className={classes.autoComplete}
        options={[]}
        multiple
        disabled={disabled}
        value={value || []}
        onChange={(_, newValue, reason) => {
          if (reason === "createOption") onChangeText("");
          onChange(newValue);
        }}
        inputValue={valueText || ""}
        onInputChange={(_, val) => {
          if (val.includes(",")) {
            const _val = val.replaceAll(",", "");
            if (_val) onChange([...(value || []), _val]);
            onChangeText("");
          } else onChangeText(val);
        }}
        onBlur={onBlur}
        freeSolo
        filterOptions={() => []}
        renderTags={(value, getTagProps) =>
          value?.map((tag, index) => {
            return (
              <Chip
                key={index}
                label={tag}
                onDelete={() => {
                  const newTagList = value?.filter((t) => t !== tag) || [];
                  onChange(newTagList);
                }}
                classes={{
                  root: clsx(classes.chip, {
                    [classes.chipErr]: !schemaEmail.isValidSync(tag),
                  }),
                }}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            className={clsx(
              className,
              !errorMessage ? classes.inputTextfield : classes.inputInvalid
            )}
            inputProps={
              {
                ...params.inputProps,
                "data-lpignore": "true",
                "autoComplete": "off"
              }
            }
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
};

export default InputTag;
