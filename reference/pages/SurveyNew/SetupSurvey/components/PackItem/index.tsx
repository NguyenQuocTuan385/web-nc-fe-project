import { MoreVert } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material"
import ChipPackType from "components/common/status/ChipPackType";
import Heading5 from "components/common/text/Heading5";
import Heading6 from "components/common/text/Heading6";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Pack } from "models/pack"
import { memo } from "react"
import { useTranslation } from "react-i18next";
import classes from './styles.module.scss';

interface PackItemProps {
  item: Pack;
  editable: boolean;
  onAction: (currentTarget: any, item: Pack) => void;
}

const PackItem = memo(({ item, editable, onAction }: PackItemProps) => {

  const { t } = useTranslation()

  return (
    <Grid item className={classes.root}>
      <Box className={classes.box}>
        <Grid className={classes.body}>
          {editable && (
            <IconButton
              className={classes.iconAction}
              onClick={(e) => onAction(e.currentTarget, item)}
            >
              <MoreVert />
            </IconButton>
          )}
          <img className={classes.img} src={item.image} alt="pack" />
          <Grid className={classes.itemInfor}>
            <Box>
              <ParagraphSmall className="ellipsis" $colorName="--eerie-black-65" translation-key="project_brand">{t('project_brand')}:</ParagraphSmall>
              <Heading6 className="ellipsis" $fontWeight={500} $colorName="--eerie-black">{item.brand || "--"}</Heading6>
            </Box>
            <Box mt={1}>
              <ParagraphSmall className="ellipsis" $colorName="--eerie-black-65" translation-key="project_variant">{t('project_variant')}:</ParagraphSmall>
              <Heading6 className="ellipsis" $fontWeight={500} $colorName="--eerie-black">{item.variant || "--"}</Heading6>
            </Box>
            <Box mt={1}>
              <ParagraphSmall className="ellipsis" $colorName="--eerie-black-65" translation-key="project_manufacturer">{t('project_manufacturer')}:</ParagraphSmall>
              <Heading6 className="ellipsis" $fontWeight={500} $colorName="--eerie-black">{item.manufacturer || "--"}</Heading6>
            </Box>
          </Grid>
        </Grid>
        <Grid className={classes.footer}>
          <Heading5 mb={1}>{item.name}</Heading5>
          <ChipPackType status={item.packTypeId} />
        </Grid>
      </Box>
    </Grid>
  )
})

export default PackItem