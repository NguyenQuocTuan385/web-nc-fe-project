import React, { useEffect, useState } from "react";

import classes from "./styles.module.scss";
import { Box, Button, Card, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import { Property } from "models/property";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { check } from "prettier";

interface PropsData {
  propertyList?: Property[];
  districtId?: number;
}

function WardFilter(propsData: PropsData) {
  const locationHook = useLocation();
  const wardParams = queryString.parse(locationHook.search).wardFilter;

  const [filteredList, setFilteredList] = useState<string[]>(() => {
    const initFilteredArray: string[] = [];
    propsData.propertyList?.forEach((item, index) => {
      if (wardParams?.includes(index.toString())) initFilteredArray.push(item.id.toString());
    });

    return initFilteredArray;
  });

  const [checkbox, setCheckbox] = useState(() => {
    const indexArray: boolean[] = [];

    propsData.propertyList?.forEach((item, index) => {
      wardParams?.includes(index.toString()) ? (indexArray[index] = true) : (indexArray[index] = false);
    });

    return indexArray;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checkIndex: number) => {
    event.target.checked
      ? setFilteredList([...filteredList, event.target.name])
      : setFilteredList(filteredList.filter((item) => item !== event.target.name));

    setCheckbox(checkbox.map((item, index) => (index === checkIndex ? (item = event.target.checked) : item)));
    console.log(checkbox);
  };

  const sendFilterHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    console.log(filteredList);
  };

  return (
    <Card className={classes.cardContainer}>
      <Heading6>Lọc danh sách hợp đồng theo phường</Heading6>

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
    </Card>
  );
}

export default WardFilter;
