import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { userSocialLogin } from "redux/reducers/User/actionTypes";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { SocialProvider } from "models/general";
import classes from "./styles.module.scss";
import icGoogle from "assets/img/icon/ic-google.svg";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { isValidBusinessEmail } from "config/yup.custom";
import UseAuth from "hooks/useAuth";
import { ReducerType } from "redux/reducers";

type GoogleProps = {
  children: string
}

const Google = ({ children }: GoogleProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isUsingGuest } = useSelector((state: ReducerType) => state.user);
  const { user } = UseAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse.hd && isValidBusinessEmail(tokenResponse.hd)) {
        dispatch(
          userSocialLogin({
            token: tokenResponse.access_token,
            provider: SocialProvider.GOOGLE,
            guestId: isUsingGuest ? user?.id : null
          })
        );

      } else {
        dispatch(setErrorMess({ message: t("field_email_vali_business") }));
      }
    },
    onError: () => {
      dispatch(setErrorMess({ message: t("auth_login_again") }));
    },
  });

  return (
    <Button
      classes={{ root: classes.icGoogle }}
      startIcon={<img src={icGoogle} alt="" />}
      onClick={() => login()}
    >
      {children}
    </Button>
  );
};
export default Google;
