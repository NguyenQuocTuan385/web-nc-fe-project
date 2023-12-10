import { useState } from "react";
import { Grid, Box, MenuItem, IconButton } from "@mui/material";
import ParagraphBody from "components/common/text/ParagraphBody"
import classes from "./styles.module.scss";
import { BrandAsset, EBRAND_ASSET_TYPE } from "models/brand_asset";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { Edit as EditIcon, DeleteForever as DeleteForeverIcon, MoreVert, Title, MusicNote } from "@mui/icons-material";
import { Menu } from "components/common/memu/Menu";
import { useTranslation } from "react-i18next";

interface Props {
  brandAsset: BrandAsset;
  editable: boolean;
  onPopupEditBrandAsset?: () => void;
  onOpenPopupConfirmDelete?: () => void;
}

const BrandAssetItem = (props: Props) => {
  const { brandAsset, editable, onPopupEditBrandAsset, onOpenPopupConfirmDelete } = props;
  const { t } = useTranslation()

  const [anchorElMenuAction, setAnchorElMenuAction] = useState<null | HTMLElement>(null);
  
  const handleClickMenuAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuAction(event.currentTarget)
  }
  const handleCloseMenuAction = () => {
    setAnchorElMenuAction(null);
  }

  return (
    <Box className={classes.wrapper}>
      <Grid className={classes.logoWrapper}>
        {brandAsset?.typeId === EBRAND_ASSET_TYPE.IMAGE && (
          <img src={brandAsset?.asset} className={classes.assetImage} alt="preview" />
        )}
        {brandAsset?.typeId === EBRAND_ASSET_TYPE.SLOGAN && (
          <Title sx={{fontSize: "32px", color: "var(--cimigo-blue)"}}/>
        )}
        {brandAsset?.typeId === EBRAND_ASSET_TYPE.SOUND && (
          <MusicNote sx={{fontSize: "30px", color: "var(--cimigo-blue)"}}/>
        )}
      </Grid>
      <Grid sx={{flex: 1}}>
        <ParagraphSmall $fontWeight={600} $colorName={"--eerie-black"}>{brandAsset?.brand}</ParagraphSmall>
        {brandAsset?.typeId !== EBRAND_ASSET_TYPE.IMAGE && (
          <ParagraphExtraSmall $colorName={"--eerie-black"}>{brandAsset?.typeId === EBRAND_ASSET_TYPE.SLOGAN ? `${brandAsset?.slogan}` : `${brandAsset?.duration}s audio`}</ParagraphExtraSmall>
        )}
      </Grid>
      <IconButton disabled={!editable} onClick={handleClickMenuAction}>
        <MoreVert sx={{fontSize: "20px", color: "var(--gray-60)"}}/>
      </IconButton>
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuAction}
        open={Boolean(anchorElMenuAction)}
        onClose={handleCloseMenuAction}
      >
        <MenuItem 
          className={classes.menuActionItem} 
          onClick={() => {
            onPopupEditBrandAsset()
            handleCloseMenuAction()
          }}
        >
          <EditIcon sx={{ fontSize: "20px" }} />
          <ParagraphBody className={classes.itemAddAttribute} translation-key="common_edit">{t("common_edit")}</ParagraphBody>
        </MenuItem>
        <MenuItem 
          className={classes.menuActionItem} 
          onClick={() => {
            onOpenPopupConfirmDelete()
            handleCloseMenuAction()
          }}
        >
          <DeleteForeverIcon sx={{ fontSize: "20px", color: "var(--red-error)" }} />
          <ParagraphBody className={classes.itemAddAttribute} translation-key="common_delete">{t("common_delete")}</ParagraphBody>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BrandAssetItem;
