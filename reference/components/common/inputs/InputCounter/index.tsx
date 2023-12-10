import { memo } from 'react';
import classes from './styles.module.scss';
import { Grid } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
interface InputsProps {
    max?: number,
    min?: number,
    value: number,
    onChange: (value: number) => void,
}
const InputCounter = memo((props: InputsProps) => {

  const { max, min, value, onChange} = props;

  const add = () => {
    const newValue = value + 1;
    if((max ?? null) !== null && newValue > max) return;
    onChange(newValue);
  }

  const minus = () => {
    const newValue = value - 1;
    if((min ?? null) !== null && newValue < min) return;
    onChange(newValue);
  }

  return (         
    <div className={classes.contentNumber}>
      <button className={classes.btnAction} type="button" onClick={minus} disabled={(min ?? null) !== null ? value <= min : false}>
          <RemoveIcon/>
      </button>
      <Grid className={classes.numberValue}>
          <input 
          value={value} 
          readOnly
          />
      </Grid>                       
      <button className={classes.btnAction} type="button" onClick={add} disabled={(max ?? null) !== null ? value >= max : false}>
        <AddIcon/>
      </button>
    </div>                                          
  );
});
export default InputCounter;



