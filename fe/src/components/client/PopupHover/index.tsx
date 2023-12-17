import { Box } from "@mui/material";
import ParagraphSmall from "../../common/text/ParagraphSmall";
import classes from "./styles.module.scss";
import ParagraphExtraSmall from "../../common/text/ParagraphExtraSmall";

const PopupHover = ({ properties }: any) => {
  return (
    <Box className={classes.popup}>
      <ParagraphExtraSmall $fontWeight={"bold"}>
        {properties.ads_form_name}
      </ParagraphExtraSmall>
      <ParagraphExtraSmall>{properties.address}</ParagraphExtraSmall>
      <ParagraphExtraSmall>{properties.location_type_name}</ParagraphExtraSmall>
      {properties.planning ? (
        <ParagraphSmall $fontWeight={"bold"}>ĐÃ QUY HOẠCH</ParagraphSmall>
      ) : (
        <ParagraphSmall $fontWeight={"bold"}>CHƯA QUY HOẠCH</ParagraphSmall>
      )}
    </Box>
  );
};

export default PopupHover;
