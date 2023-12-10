import { memo, useMemo, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import classes from './styles.module.scss';

interface Props {
    apikey?: string;
}
const LabelKey = memo(({ apikey }: Props) => {

    const [showApikey, setShowApikey] = useState<boolean>(false);

    const actionEye = ()=>{
        setShowApikey(!showApikey)
    }
    const valueShow = useMemo(()=> {
        return !showApikey ? `********************************${apikey.slice(-4)}` : apikey
    },[showApikey,apikey])

    return(
        <div className={classes.alertKey}>
            {valueShow} 
            <div className={classes.btnEye} onClick ={actionEye}>
                {!showApikey ? <RemoveRedEyeIcon sx={{marginLeft: 3, fontSize: 20, cursor: "pointer"}}/> : <VisibilityOffIcon sx={{marginLeft: 3, fontSize: 20, cursor: "pointer"}}/>}
            </div>
        </div>
    )
})
export default LabelKey;