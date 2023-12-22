import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";

const PopoverHover = ({ properties }: any) => {
  const locationTypeName = JSON.parse(properties.locationType).name;
  const adsFormName = JSON.parse(properties.adsForm).name;
  return (
    <Box className={classes.popup}>
      <ParagraphExtraSmall $fontWeight={"bold"}>{adsFormName}</ParagraphExtraSmall>
      <ParagraphExtraSmall>{properties.address}</ParagraphExtraSmall>
      <ParagraphExtraSmall>{locationTypeName}</ParagraphExtraSmall>
      {properties.planning ? (
        <ParagraphSmall $fontWeight={"bold"}>ĐÃ QUY HOẠCH</ParagraphSmall>
      ) : (
        <ParagraphSmall $fontWeight={"bold"}>CHƯA QUY HOẠCH</ParagraphSmall>
      )}
    </Box>
  );
};

export default PopoverHover;
