import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';
import { Box, Grid, Stack, Typography } from "@mui/material";
import Buttons from "components/Buttons";
import { routes } from 'routers/routes';
import { LoginForm } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useEffect, useMemo, useState } from "react";
import Popup from "components/Popup";
import { EKey } from "models/general";
import { setUserLogin, setUserUsingGuest } from "redux/reducers/User/actionTypes";
import { push } from "connected-react-router";
import Google from "components/SocialButton/Google";
import { useTranslation } from 'react-i18next';
import { ReducerType } from "redux/reducers";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputTextfield from "components/common/inputs/InputTextfield";
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmallUnderline from "components/common/text/ParagraphSmallUnderline";
import BasicLayout from "layout/BasicLayout";
import { Helmet } from "react-helmet";
import UseAuth from "hooks/useAuth";
import HeadLineSmall from "components/common/headline/Small";
import Separator from "components/common/separator";

const Login = () => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string()
        .email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
      password: yup.string()
        .required(t('field_password_vali_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { createProjectRedirect } = useSelector((state: ReducerType) => state.project)

  const dispatch = useDispatch()
  const [errorSubmit, setErrorSubmit] = useState(false)
  const { isUsingGuest } = useSelector((state: ReducerType) => state.user);
  const { user } = UseAuth();

  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      errorSubmit && setErrorSubmit(false)
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const onSubmit = (data: LoginForm) => {
    dispatch(setLoading(true))
    UserService.login({
      ...data,
      guestId: isUsingGuest ? user?.id : null
    })
      .then((res) => {
        localStorage.setItem(EKey.TOKEN, res.token)
        localStorage.removeItem(EKey.TOKEN_GUEST);
        dispatch(setUserUsingGuest(false));
        dispatch(setUserLogin(res.user))
        if (createProjectRedirect) {
          dispatch(push(routes.project.create));
        }
      })
      .catch(e => {
        if (e.detail === 'notVerified')
          dispatch(push({
            pathname: routes.verifyEmail,
            search: `?email=${data.email}`
          }));
        else setErrorSubmit(true)
      })
      .finally(() => dispatch(setLoading(false)))

  };


  return (
    <BasicLayout className={classes.root}>
      <Helmet>
        <title>RapidSurvey - Login</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)} name="login" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <HeadLineSmall translation-key="login_title">{t('login_title')}</HeadLineSmall>
          {isUsingGuest ? (
            <div className={classes.alertLoginGuest}>
              <ParagraphSmall
                $colorName="--gray-90"
                translation-key="project_guest_login_announcement"
                dangerouslySetInnerHTML={{
                  __html: t("project_guest_login_announcement"),
                }}
              ></ParagraphSmall>
            </div>
          ) : (
            <ParagraphSmall $colorName="--gray-80" className={classes.subText} translation-key="login_subtitle">{t('login_subtitle')}</ParagraphSmall>
          )}
          <Stack spacing={2} mb={2}>
            <InputTextfield
              title={t('field_email_address')}
              translation-key="field_email_address"
              name="email"
              placeholder={t('field_business_email_placeholder')}
              translation-key-placeholder="field_business_email_placeholder"
              type="text"
              inputRef={register('email')}
              errorMessage={errors.email?.message}
            />
            <InputTextfield
              title={t('field_password')}
              translation-key="field_password"
              name="password"
              type="password"
              showEyes
              placeholder={t('field_password_placeholder')}
              translation-key-placeholder="field_password_placeholder"
              inputRef={register('password')}
              errorMessage={errors.password?.message}
            />
          </Stack>
          <Grid className={classes.checkbox}>
            <div></div>
            <ParagraphSmallUnderline to={routes.forgotPassword} translation-key="login_redirect_forgot_password">{t('login_redirect_forgot_password')}</ParagraphSmallUnderline>
          </Grid>
          {errorSubmit && (
            <Typography className={classes.errorText} translation-key="login_invalid_error">
              {t('login_invalid_error')}
            </Typography>
          )}
          <Button
            btnType={BtnType.Raised}
            type='submit'
            translation-key="login_btn_login"
            children={<TextBtnSecondary>{t('login_btn_login')}</TextBtnSecondary>}
            className={classes.btnLoginForm}
          />
          <ParagraphSmall $colorName={"--gray-80"} className={classes.linkText} translation-key="login_do_not_have_account">{t('login_do_not_have_account')}
            <ParagraphSmallUnderline to={routes.register} translation-key="register_title">
              {t('register_title')}
            </ParagraphSmallUnderline>
          </ParagraphSmall>
          <Separator>
            <ParagraphSmall $colorName={"--gray-80"} className={classes.childrenSeparator} translation-key="login_login_with">{t('login_login_with')}</ParagraphSmall>
          </Separator>
          <Google>{t('login_btn_with', { name: 'Google' })}</Google>
        </Grid>
      </form>
    </BasicLayout>
  );
};
export default Login;