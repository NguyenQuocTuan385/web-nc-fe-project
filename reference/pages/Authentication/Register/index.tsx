import classes from './styles.module.scss';
import { Grid, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountryService from "services/country";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { EKey, OptionItem } from "models/general";
import UserService from "services/user";
import { routes } from "routers/routes";
import BasicLayout from "layout/BasicLayout";
import { Helmet } from "react-helmet";
import UseAuth from "hooks/useAuth";
import { ReducerType } from "redux/reducers";
import { push } from 'connected-react-router';
import RegisterStep1, { RegisterForm1 } from "./Step1";
import RegisterStep2, { RegisterForm2 } from "./Step2";
import RegisterStep3, { RegisterForm3 } from "./Step3";
import RegisterTabs from "./components/RegisterTabs";

export enum ETabRegister {
  STEP_1,
  STEP_2,
  STEP_3,
}

interface DataForm {
  [ETabRegister.STEP_1]: RegisterForm1
  [ETabRegister.STEP_2]: RegisterForm2
}

const Register = () => {

  const [activeTab, setActiveTab] = useState<ETabRegister>(ETabRegister.STEP_1);

  const { isUsingGuest } = useSelector((state: ReducerType) => state.user);
  const { user } = UseAuth();
  const dispatch = useDispatch()
  const [registerData, setRegisterData] = useState<DataForm>()
  const [countries, setCountries] = useState<OptionItem[]>([])

  const onRegister = (data: RegisterForm3) => {
    dispatch(setLoading(true))
    UserService.register({
      email: registerData[ETabRegister.STEP_1].email,
      firstName: registerData[ETabRegister.STEP_1].firstName,
      lastName: registerData[ETabRegister.STEP_1].lastName,
      phone: registerData[ETabRegister.STEP_2].phone,
      company: registerData[ETabRegister.STEP_2].company,
      password: data.password,
      countryId: registerData[ETabRegister.STEP_1].countryId.id,
      guestId: isUsingGuest ? user?.id : null
    })
      .then(() => {
        localStorage.removeItem(EKey.TOKEN_GUEST);
        dispatch(push({
          pathname: routes.verifyEmail,
          search: `?email=${registerData[ETabRegister.STEP_1].email}`
        }));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    activeTab > newValue && setActiveTab(newValue)
  }


  const onNext = (
    step: ETabRegister,
    nextStep: ETabRegister
  ) => (data: RegisterForm1 | RegisterForm2) => {

    setRegisterData(prev => ({ ...prev, [step]: data }));

    setActiveTab(nextStep);

  };


  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      const data = await CountryService.getCountries({ take: 9999 })
        .catch((e) => {
          dispatch(setErrorMess(e))
          return null
        })
      setCountries(data?.data || [])
      dispatch(setLoading(false))
    }
    fetchData()
  }, [dispatch])




  return (
    <BasicLayout className={classes.root}>
      <Helmet>
        <title>RapidSurvey - Register</title>
      </Helmet>

      <Grid className={classes.body}>
        <RegisterTabs
          value={activeTab}
          onChange={handleChangeTab}
        >
          <Tab />
          <Tab />
          <Tab />
        </RegisterTabs>
        <RegisterStep1 value={activeTab} index={ETabRegister.STEP_1} onNext={onNext(ETabRegister.STEP_1, ETabRegister.STEP_2)} countries={countries} />
        <RegisterStep2 value={activeTab} index={ETabRegister.STEP_2} onNext={onNext(ETabRegister.STEP_2, ETabRegister.STEP_3)} />
        <RegisterStep3 value={activeTab} index={ETabRegister.STEP_3} onRegister={onRegister} data={registerData?.[ETabRegister.STEP_1]} />
      </Grid>

    </BasicLayout>
  );
};
export default Register;