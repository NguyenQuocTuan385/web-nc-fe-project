import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog } from "@mui/material";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";
import { AdditionalBrand, EBrandType } from "models/additional_brand";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ProjectHelper from "helpers/project";

interface BrandForm {
  brand: string;
  variant: string;
  manufacturer: string;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSubmit: (data: BrandForm) => void;
  brand: AdditionalBrand;
  brandType: EBrandType;
}

const PopupAddOrEditAdditionalBrand = (props: Props) => {
  const { isOpen, project, brand, brandType, onClose, onSubmit } = props;

  const { t, i18n } = useTranslation();

  const numberOfCompetingBrandCanBeAdd = useMemo(() => ProjectHelper.numberOfCompetingBrandCanBeAdd(project) || 0, [project])
  
  const schema = useMemo(() => {
    return yup.object().shape({
      brand: yup.string().required(t("brand_track_field_brand_name_vali_required")),
      variant: yup.string().required(t("brand_track_field_brand_variant_vali_required")),
      manufacturer: yup.string().nullable(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BrandForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data) => {
    onSubmit(data)
    onClose()
  };
  
  const onSaveAndAddAnother = (data) => {
    onSubmit(data)
    clearForm()
  };

  const clearForm = () => {
    reset({
      brand: "",
      variant: "",
      manufacturer: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      clearForm()
    } else {
      if(brand) {
        reset({
          brand: brand.brand,
          variant: brand.variant,
          manufacturer: brand?.manufacturer,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const _onClose = () => {
    onClose()
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle $backgroundColor="--white">
          {brandType === EBrandType.MAIN ? (
            <Heading3 $colorName="--gray-90" translation-key="brand_track_setup_popup_additional_brand_main_brand">
              {t("brand_track_setup_popup_additional_brand_main_brand")} 
            </Heading3>
          ) : brand ? (
            <Heading3 $colorName="--gray-90" translation-key="brand_track_setup_popup_additional_brand_edit_competing_brand_title">
              {t("brand_track_setup_popup_additional_brand_edit_competing_brand_title")}
            </Heading3>
          ) : (
            <Heading3 $colorName="--gray-90" translation-key="brand_track_setup_popup_additional_brand_add_competing_brand_title">
              {t("brand_track_setup_popup_additional_brand_add_competing_brand_title")}
            </Heading3>
          )}
          <ButtonCLose
            $backgroundColor="--eerie-black-5"
            $colorName="--eerie-black-40"
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers sx={{marginBottom: "8px"}}>
          {brandType === EBrandType.MAIN ? (
            <ParagraphBody $colorName="--eerie-black" mb={3} translation-key="brand_track_setup_popup_additional_brand_main_brand_title">
              {t("brand_track_setup_popup_additional_brand_main_brand_title")}
            </ParagraphBody>
          ) : (
            <ParagraphBody $colorName="--eerie-black" mb={3} translation-key="brand_track_setup_popup_additional_brand_competing_brand_title">
              {t("brand_track_setup_popup_additional_brand_competing_brand_title")}
            </ParagraphBody>
          )}
          <Grid container rowSpacing={2} columnSpacing={3}>
            <Grid item xs={12} md={6}>
              <ParagraphSmall $colorName="--gray-80" translation-key="brand_track_field_brand_name">
                {t("brand_track_field_brand_name")}
              </ParagraphSmall>
              <InputTextfield
                translation-key="brand_track_field_brand_name_placeholder"
                className={classes.inputField}
                placeholder={t("brand_track_field_brand_name_placeholder")}
                type="text"
                autoComplete="off"
                inputRef={register("brand")}
                errorMessage={errors.brand?.message}
              />
            </Grid>
            <Grid item xs={12} md={6} pt={{xs: 2, md: 0}}>
              <ParagraphSmall $colorName="--gray-80" translation-key="brand_track_field_brand_variant">
                {t("brand_track_field_brand_variant")}
              </ParagraphSmall>
              <InputTextfield
                translation-key="brand_track_field_brand_variant_placeholder"
                className={classes.inputField}
                placeholder={t("brand_track_field_brand_variant_placeholder")}
                type="text"
                autoComplete="off"
                inputRef={register("variant")}
                errorMessage={errors.variant?.message}
              />
            </Grid>
            <Grid item xs={12} pt={{xs: 2}}>
              <ParagraphSmall $colorName="--gray-80" translation-key="brand_track_field_brand_manufacturer">
                {t("brand_track_field_brand_manufacturer")}
              </ParagraphSmall>
              <InputTextfield
                translation-key="brand_track_field_brand_manufacturer_placeholder"
                className={classes.inputField}
                placeholder={t("brand_track_field_brand_manufacturer_placeholder")}
                type="text"
                autoComplete="off"
                inputRef={register("manufacturer")}
                errorMessage={errors.manufacturer?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button
            btnType={BtnType.Secondary}
            translation-key="common_cancel"
            children={<TextBtnSmall>{t("common_cancel")}</TextBtnSmall>}
            className={classes.btnCancel}
            onClick={onClose}
          />
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="common_save"
            children={<TextBtnSmall>{t("common_save")}</TextBtnSmall>}
            className={classes.btnSave}
          />
          {!brand && brandType === EBrandType.COMPETING && numberOfCompetingBrandCanBeAdd > 1 && (
            <Button
              btnType={BtnType.Raised}
              translation-key="common_save_and_add_another"
              children={<TextBtnSmall>{t("common_save_and_add_another")}</TextBtnSmall>}
              className={classes.btnSave}
              onClick={handleSubmit(onSaveAndAddAnother)}
              />
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupAddOrEditAdditionalBrand;
