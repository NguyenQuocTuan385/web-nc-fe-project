import { Box, Grid } from "@mui/material";
import ParagraphBody from "components/common/text/ParagraphBody";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss"
import { priceTestTypes } from "models";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import ErrorMessage from "components/common/text/ErrorMessage";

interface SelectPriceTestTypeProps {
    name?: string,
    control?: any,
    errorMessage?: string | null,
}
export const SelectPriceTestType = ( {name, control, errorMessage}: SelectPriceTestTypeProps) => {
    const { t } = useTranslation();

    return (
        <Controller
            name={name}
            control={control}
            render={ ({ field }) => 
                <Box>
                    <Grid container direction="row" className={classes.content}>   
                        {priceTestTypes.map((item, _) => (
                            <Box  
                            key={item.id}
                            onBlur={field.onBlur}
                            onClick={() => {field.onChange(item.id)}} 
                            className={clsx(classes.tabTypePriceTest, {[classes.tabActive]: field.value === item.id})}>
                                <img src={item.img} alt="Tab Type Price Test"/>
                                <ParagraphBody $fontWeight="500" $colorName="--eerie-black" letterSpacing="0.15px"
                                               translation-key={item.name}>
                                    {t(item.name)}
                                </ParagraphBody>
                            </Box>
                        ))}
                    </Grid>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                </Box>
        }
        />
    )
}