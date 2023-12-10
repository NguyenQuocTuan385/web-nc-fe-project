import { Checkbox, CheckboxProps, InputAdornment, Tooltip } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import { useTranslation } from "react-i18next";

interface Props extends CheckboxProps {
    translationKey: string,
    surveyLanguage?: string
}

const IconLanguage = memo((props: Props) => {
    const { t } = useTranslation();

    const { translationKey, surveyLanguage } = props

    return <InputAdornment position="start">
        <Tooltip
            translation-key={translationKey}
            title={t(translationKey)}
        >
            <div className={classes.iconLanguage}>{surveyLanguage}</div>
        </Tooltip>
    </InputAdornment>
})

export default IconLanguage