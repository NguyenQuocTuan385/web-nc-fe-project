import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import classes from "./styles.module.scss";
import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import district from "../../../../district.json";

interface District {
  id: number;
  name: string;
  wards: {
    id: number;
    name: string;
  }[];
}
const districts: District[] = district;
export default function EditProfileDetail() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDistrict, setSelectedDistrict] =
    React.useState<District | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<District | null>(null);
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: District) => option.name,
  });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Box className={classes.imageContainer}>
            <img
              src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/385780595_784340566826510_8513447287827069210_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=GAImUy0MBpQAX83N_Iw&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBvnNhzjKmg3twnhZCz_D5mFrCYVy85E0G1u0aimZURQg&oe=6588C1D0"
              alt="profile"
              className={classes.image}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box className={classes.formContainer}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box className={classes.title}>Họ và tên</Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={"Nguyễn Quốc Tuấn"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Email</Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={"ngqt@gmail.com"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Ngày sinh</Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={"10/11/2002"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Số điện thoại</Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={"09083276462"}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Phân hệ</Box>

                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Quận"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Phường"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={5}>
                    <Grid item xs={6}>
                      <Box className={classes.title}>Quận</Box>

                      <Autocomplete
                        id="filter-demo"
                        options={districts}
                        getOptionLabel={(option) => option.name}
                        filterOptions={filterOptions}
                        onChange={(event, newValue) => {
                          setSelectedDistrict(newValue);
                          setSelectedWard(null);
                        }}
                        value={selectedDistrict}
                        renderInput={(params) => (
                          <TextField {...params} label="Quận" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={classes.title}>Phường</Box>

                      <Autocomplete
                        id="filter-demo"
                        options={
                          districts.filter(
                            (district) => district.id === selectedDistrict?.id
                          )[0]?.wards
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) =>
                          setSelectedWard(newValue as District | null)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Phường" />
                        )}
                        value={selectedWard}
                        disabled={selectedDistrict === null}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" fullWidth>
                    Lưu
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
