import { Grid, useMediaQuery, useTheme } from "@mui/material"
import { memo, useEffect, useMemo, useState } from "react";
import classes from './styles.module.scss';
import { CameraAlt } from '@mui/icons-material';
import Inputs from "components/common/inputs/InputTextfield";
import InputSelect from "components/common/inputs/InputSelect";
import Button, {BtnType} from "components/common/buttons/Button"
import Heading3 from "components/common/text/Heading3";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import images from "config/images";
import { OptionItem } from "models/general";
import { useTranslation } from "react-i18next";
import { setSuccessMess, setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { VALIDATION } from "config/constans";
import UploadImage from "components/UploadImage";
import UserService from "services/user";
import { getMe } from "redux/reducers/User/actionTypes";
import UseAuth from "hooks/useAuth";
export interface UserFormData {
    avatar: File | string;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    countryId: OptionItem;
    company: string;
    fullName: string;
}

interface Props {

}

const UserProfile = memo((props: Props) => {
    const dispatch = useDispatch()
    const theme = useTheme();
    const { t, i18n } = useTranslation()
    const isMobile = useMediaQuery(theme.breakpoints.down(600));
    const { user } = UseAuth();
    const schema = useMemo(() => {
        return yup.object().shape({
            avatar: yup.mixed(),
            firstName: yup.string()
                .required(t('field_first_name_vali_required')),
            lastName: yup.string()
                .required(t('field_last_name_vali_required')),
            title: yup.string(),
            email: yup.string()
                .email(t('field_email_vali_email')),
            phone: yup.string().matches(VALIDATION.phone,
                { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }),
            company: yup.string(),
            countryId: yup.object().shape({
                id: yup.number().required(t('field_country_vali_required')),
                name: yup.string().required()
            }).required(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])
    const [countries, setCountries] = useState<OptionItem[]>([])
    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<UserFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    useEffect(() => {
        if (user) {
            reset({
                avatar: user.avatar || images.icProfile || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                title: user.title || '',
                email: user.email || '',
                countryId: user.country ? { id: user.country.id, name: user.country.name } : undefined,
                company: user.company || '',
                phone: user.phone || '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, reset])

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === "avatar") {
                if (typeof value.avatar === 'object') {
                    const form = new FormData()
                    form.append('avatar', value.avatar)
                    UserService.updateAvatar(form)
                        .then(() => {
                            dispatch(getMe())
                        })
                        .catch((e) => dispatch(setErrorMess(e)))
                        .finally(() => dispatch(setLoading(false)))
                }
            }
        })
        return () => subscription.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    const onSubmit = (data: UserFormData) => {
        const form = new FormData()
        form.append('firstName', data.firstName)
        form.append('lastName', data.lastName)
        form.append('title', data.title)
        form.append('countryId', `${data.countryId.id}`)
        form.append('company', data.company)
        form.append('phone', data.phone)
        dispatch(setLoading(true))
        UserService.update(form)
            .then(() => {
                dispatch(getMe())
                dispatch(setSuccessMess(t("common_update_success")))
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} >
            <Grid className={classes.rowInfo}>
                <div className={classes.personalImage} >
                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field }) => <UploadImage
                            file={field.value}
                            errorMessage={errors.avatar?.message}
                            onChange={(value) => field.onChange(value)}
                            className={classes.avatar}
                        />}
                    />
                    <label htmlFor="upload" className={classes.uploadAvatar}>
                        <CameraAlt />
                    </label>
                </div>
                <div className={classes.personalInfo}>
                    <Heading3 $colorName="--eerie-black" className={classes.name}>{user?.fullName}</Heading3>
                    <ParagraphSmall>{user?.company ? `${user?.company}, ` : ""}{user?.country?.name}</ParagraphSmall>
                </div>
            </Grid>
            <Grid container columnSpacing={isMobile ? 0 : 1} rowSpacing={3} className={classes.customMargin}>
                <Grid item xs={12} sm={6}>
                    <Inputs
                        title={t('field_first_name')}
                        translation-key="field_first_name"
                        name="firstName"
                        type="text"
                        placeholder={t('field_first_name_placeholder')}
                        translation-key-placeholder="field_first_name_placeholder"
                        inputRef={register('firstName')}
                        errorMessage={errors.firstName?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Inputs
                        title={t('field_last_name')}
                        translation-key="field_last_name"
                        name="lastName"
                        type="text"
                        placeholder={t('field_last_name_placeholder')}
                        translation-key-placeholder="field_last_name_placeholder"
                        inputRef={register('lastName')}
                        errorMessage={errors.lastName?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Inputs
                        title={t('field_email')}
                        translation-key="field_email"
                        name="email"
                        type="text"
                        placeholder={t('field_email_placeholder')}
                        translation-key-placeholder="field_email_placeholder"
                        inputRef={register('email')}
                        errorMessage={errors.email?.message}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Inputs
                        title={t('field_phone_number')}
                        name="phone"
                        optional
                        type="text"
                        placeholder={t('field_phone_number_placeholder')}
                        translation-key-placeholder="field_phone_number_placeholder"
                        inputRef={register('phone')}
                        errorMessage={errors.phone?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputSelect
                        fullWidth
                        title={t('field_country')}
                        name="countryId"
                        control={control}
                        selectProps={{
                            options: countries,
                            placeholder: t('field_country_placeholder'),
                        }}
                        errorMessage={(errors.countryId as any)?.id?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Inputs
                        title={t('field_company')}
                        translation-key="field_company"
                        optional
                        name="company"
                        type="text"
                        placeholder={t('field_company_placeholder')}
                        translation-key-placeholder="field_company_placeholder"
                        inputRef={register('company')}
                        errorMessage={errors.company?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Inputs
                        title={t('field_your_title')}
                        translation-key="field_your_title"
                        optional
                        name="title"
                        type="text"
                        placeholder={t('field_your_title_placeholder')}
                        translation-key-placeholder="field_your_title_placeholder"
                        inputRef={register('title')}
                        errorMessage={errors.title?.message}
                    />
                </Grid>
            </Grid>
            <Button btnType={BtnType.Primary} type='submit' children={t("common_save_changes")} translation-key="common_save_changes" className={classes.btnSave}/> 
        </form>
    )
})
export default UserProfile