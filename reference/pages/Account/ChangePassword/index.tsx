import { Divider, Grid } from "@mui/material";
import { memo, useMemo, useState, useEffect } from "react";
import classes from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "components/common/inputs/InputTextfield";
import { VALIDATION } from "config/constans";
import { useTranslation } from "react-i18next";
import Buttons, {BtnType} from "components/common/buttons/Button";
import Heading2 from "components/common/text/Heading2";
import ParagraphBody from "components/common/text/ParagraphBody";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useDispatch } from "react-redux";
import clsx from "clsx"

interface Props { }

interface DataForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = memo((props: Props) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [isEmptyPassword, setIsEmptyPassword] = useState(false)

  useEffect(() => {
    dispatch(setLoading(true));
    UserService.checkEmptyPassword()
      .then((res) => {
        setIsEmptyPassword(res)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schema = useMemo(() => {
    return yup.object().shape({
      currentPassword: isEmptyPassword ? yup.string() : yup.string().required(t("field_current_password_vali_required")),
      newPassword: yup
        .string()
        .matches(VALIDATION.password, {
          message: t("field_new_password_vali_password"),
          excludeEmptyString: true,
        })
        .notOneOf(
          [yup.ref("currentPassword")],
          t("field_confirm_new_password_different_current_password")
        )
        .required(t("field_new_password_vali_required")),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("newPassword")],
          t("field_confirm_new_password_vali_password_do_not_match")
        )
        .required(t("field_confirm_new_password_vali_required")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, isEmptyPassword]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true));
    UserService.changePassword(data)
      .then((res) => {
        dispatch(setSuccessMess(res.message));
        if (isEmptyPassword) {
          setIsEmptyPassword(false)
        }
        reset();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Grid className={classes.root}>
      <Heading2 className={classes.title} translation-key="auth_change_password_title">
        {t("auth_change_password_title")}
      </Heading2>
      <ParagraphBody
        $colorName="--gray-80"
        className={classes.subTitle}
        translation-key="auth_change_password_sub"
      >
        {t("auth_change_password_sub")}
      </ParagraphBody>
      <Divider className={classes.divider} />
      {isEmptyPassword &&
        <ParagraphBody
          $colorName="--gray-80"
          className={clsx(classes.subTitle, classes.emptyPasswordTitle)}
          translation-key="auth_change_empty_password"
        >
          {t("auth_change_empty_password")}
        </ParagraphBody>
      }
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="change-password"
        noValidate
        autoComplete="off"
        className={classes.form}
      >
        <Grid container spacing={3}>
          {
            !isEmptyPassword &&
            ( <Grid item xs={12} sm={12}>
                <Inputs
                  title={t("field_current_password")}
                  translation-key="field_current_password"
                  name="currentPassword"
                  placeholder={t("field_current_password_placeholder")}
                  translation-key-placeholder="field_current_password_placeholder"
                  type="password"
                  showEyes
                  inputRef={register("currentPassword")}
                  errorMessage={errors.currentPassword?.message}
                />
              </Grid>
            )
          }
          <Grid item xs={12} sm={12}> 
            <Inputs
              title={t("field_new_password")}
              translation-key="field_new_password"
              name="newPassword"
              placeholder={t("field_new_password_placeholder")}
              translation-key-placeholder="field_new_password_placeholder"
              type="password"
              showEyes
              inputRef={register("newPassword")}
              errorMessage={errors.newPassword?.message}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Inputs
              title={t("field_confirm_new_password")}
              translation-key="field_confirm_new_password"
              name="confirmPassword"
              placeholder={t("field_confirm_new_password_placeholder")}
              translation-key-placeholder="field_confirm_new_password_placeholder"
              type="password"
              showEyes
              inputRef={register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
            />
          </Grid>
        </Grid>
        <Buttons
          type={"submit"}
          children={t("reset_password_btn_submit")}
          translation-key="reset_password_btn_submit"
          btnType={BtnType.Primary}
          className={classes.btnSubmit}
        />
      </form>
    </Grid>
  );
});

export default ChangePassword;
