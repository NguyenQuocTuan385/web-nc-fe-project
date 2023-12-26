import React, { useEffect, useState } from "react";

import classes from "./styles.module.scss";
import { Box, Button, Card, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import { Property } from "models/property";
import Checkbox from "@mui/material/Checkbox";

interface PropsData {
  propertyList?: Property[];
  districtId?: number;
}

function WardFilter(propsData: PropsData) {
  const [checkbox, setCheckbox] = useState([]);
  const [filteredList, setFilteredList] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.checked
      ? setFilteredList([...filteredList, event.target.name])
      : setFilteredList(filteredList.filter((item) => item !== event.target.name));
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
              control={<Checkbox name={propertyItem.id.toString()} checked={checkbox[index]} onChange={handleChange} />}
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
