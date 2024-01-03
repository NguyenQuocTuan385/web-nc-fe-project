import classes from "./styles.module.scss";
import { memo } from "react";
import ErrorMessage from "components/common/text/ErrorMessage";
import clsx from "clsx";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import TextTitle from "../text/TextTitle";
interface InputSelectProps {
  name: string;
  elements?: any;
  title?: string;
  errorMessage?: string | null;
  control?: any;
}
const InputSelect = memo((props: InputSelectProps) => {
  const { name, control, elements, errorMessage, title } = props;

  return (
    <>
      <FormControl>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>{title}</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    fullWidth
                    classes={{
                      root: clsx({
                        [classes.inputInvalid]: !!errorMessage
                      })
                    }}
                  >
                    {!!elements &&
                      elements.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </>
              )}
            />
          </Grid>
        </Grid>
      </FormControl>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
});

export default InputSelect;
