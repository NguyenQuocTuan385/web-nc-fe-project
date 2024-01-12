import React, { useState } from "react";

import classes from "./styles.module.scss";
import { Box, Button, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { Property } from "models/property";
import Checkbox from "@mui/material/Checkbox";
import { useLocation, useSearchParams } from "react-router-dom";
import { openFilterDialog } from "reduxes/Status";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import Heading4 from "components/common/text/Heading4";

interface PropsData {
  propertyList?: Property[];
  selectedId?: (string | null)[];
}

function WardFilter(propsData: PropsData) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filteredList, setFilteredList] = useState<string[]>(() => {
    const initFilteredArray: string[] = [];

    propsData.propertyList?.forEach((item, index) => {
      if (propsData.selectedId?.includes(item.id.toString()))
        initFilteredArray.push(item.id.toString());
    });

    return initFilteredArray;
  });

  const [checkbox, setCheckbox] = useState<boolean[]>(() => {
    const indexArray: boolean[] = [];

    propsData.propertyList?.forEach((item, index) => {
      if (propsData.selectedId?.includes(item.id.toString())) indexArray.push(true);
      else indexArray.push(false);
    });

    console.log(indexArray);
    return indexArray || [];
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checkIndex: number) => {
    event.target.checked
      ? setFilteredList([...filteredList, event.target.name])
      : setFilteredList(filteredList.filter((item) => item !== event.target.name));

    setCheckbox(
      checkbox.map((item, index) => (index === checkIndex ? (item = event.target.checked) : item))
    );
  };

  const sendFilterHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // Clear the existing values for the key 'item'
    searchParams.delete("wardFilter");

    // Add each item in the list to the 'item' key
    filteredList.forEach((item) => {
      searchParams.append("wardFilter", item);
    });

    setSearchParams(searchParams, { replace: true });

    dispatch(openFilterDialog(false));
  };

  return (
    <Box className={classes.cardContainer}>
      <Heading4>Lọc danh sách hợp đồng theo phường</Heading4>

      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend'>Chọn phường</FormLabel>

        <FormGroup className={classes.wardGroup}>
          {propsData.propertyList?.map((propertyItem, index) => (
            <FormControlLabel
              key={propertyItem.id}
              control={
                <Checkbox
                  name={propertyItem.id.toString()}
                  checked={checkbox[index]}
                  onChange={(e) => handleChange(e, index)}
                />
              }
              label={propertyItem.name}
            />
          ))}
        </FormGroup>
      </FormControl>

      <Button
        fullWidth
        variant='contained'
        color='primary'
        className={classes.sendFilterButton}
        onClick={sendFilterHandler}
      >
        Hiển thị kết quả
      </Button>
    </Box>
  );
}

export default WardFilter;
