import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography, Divider } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { Solution, SolutionCategory, SolutionCategoryHome } from "models/Admin/solution";
import { memo, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import yup from 'config/yup.custom';
import ReactQuill from 'react-quill';
import { OptionItem } from "models/general";
import classes from './styles.module.scss';
import InputSelect from "components/InputsSelect";
import TextTitle from "components/Inputs/components/TextTitle";
import ErrorMessage from "components/Inputs/components/ErrorMessage";
import clsx from "clsx";
import UploadImage from "components/UploadImage";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import AdminSolutionService from "services/admin/solution";
import UploadFile from "components/UploadFile";
import { FileUpload } from "models/attachment";
import { ESOLUTION_TYPE, solutionTypes } from "models";
import { EOPERATION_TYPE, operationTypes } from "models/general";
import InputTextareaAutosize from "components/InputTextareaAutosize";

const modules = {
  toolbar: [
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
  ],
}
const schema = yup.object().shape({
  image: yup.mixed().required('Image is required.'),
  title: yup.string().required('Title is required.'),
  description: yup.string().required('Description is required.'),
  content: yup.string().required('Content is required.'),
  categoryId: yup.object().shape({
    id: yup.number().required('Category is required.'),
    name: yup.string().required()
  }).required(),
  categoryHomeId: yup.object().shape({
    id: yup.number(),
    name: yup.string()
  }).nullable(),
  typeId: yup.object().shape({
    id: yup.number().required('Type is required.'),
    name: yup.string().required()
  }).required(),

  //PACK
  minPack: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Min Pack is required.')
        .min(0)
        .integer('Min Pack must be a integer number')
        .required('Min Pack is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxPack: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Max Pack is required.')
        .positive('Max Pack must be a positive number')
        .required('Max Pack is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minAdditionalBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Min Additional Brand is required.')
        .min(0)
        .integer('Min Additional Brand must be a integer number')
        .required('Min Additional Brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxAdditionalBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Max Additional Brand is required.')
        .positive('Max Additional Brand must be a positive number')
        .required('Max Additional Brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxAdditionalAttribute: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Max Additional Attribute is required.')
        .positive('Max Additional Attribute must be a positive number')
        .required('Max Additional Attribute is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),

  //ADTRACTION
  minVideo: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.VIDEO_CHOICE,
      then: yup.number()
        .typeError('Min Video is required.')
        .min(0)
        .integer('Min Video must be a integer number')
        .required('Min Video is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxVideo: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.VIDEO_CHOICE,
      then: yup.number()
        .typeError('Max Video is required.')
        .positive('Max Video must be a positive number')
        .required('Max Video is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minMainBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Min main brand must be an integer')
        .typeError('Min main brand is required.')
        .positive('Min main brand must be a positive number')
        .required('Min main brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxMainBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Max main brand must be an integer')
        .typeError('Max main brand is required.')
        .positive('Max main brand must be a positive number')
        .required('Max main brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minCompetingBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Min competing brand must be an integer.')
        .typeError('Min competing brand is required.')
        .positive('Min competing brand must be a positive number')
        .required('Min competing brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxCompetingBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer()
        .typeError('Max competing brand is required.')
        .positive('Max competing brand must be a positive number')
        .required('Max competing brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minCompetitiveBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Min competitive brand must be an integer.')
        .typeError('Min competitive brand is required.')
        .positive('Min competitive brand must be a positive number')
        .required('Min competitive brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxCompetitiveBrand: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Max competitive brand must be an integer.')
        .typeError('Max competitive brand is required.')
        .positive('Max competitive brand must be a positive number')
        .required('Max competitive brand is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minEquityAttributes: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .typeError('Min equity attributes is required.')
        .integer('Min equity must be a integer number')
        .min(0, 'Min equity attributes must be greater than or equal to 0')
        .required('Min equity attributes is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxEquityAttributes: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Max equity attributes must be an integer.')
        .typeError('Max equity attributes is required.')
        .positive('Max equity attributes must be a positive number')
        .required('Max equity attributes is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  minBrandAssetRecognition: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .typeError('Min brand asset recognition is required.')
        .integer('Min brand asset must be a integer number')
        .min(0, 'Min brand asset recognition must be must be greater than or equal to 0')
        .required('Min brand asset recognition is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxBrandAssetRecognition: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .integer('Max brand asset recognition must be an integer')
        .typeError('Max brand asset recognition is required.')
        .positive('Max brand asset recognition must be a positive number')
        .required('Max brand asset recognition is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  //PRICE TEST
  minPicture: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PRICE_TEST,
      then: yup.number()
        .integer("Min picture must be an integer")
        .typeError("Min picture is required")
        .min(0, "Min picture must be must be greater than or equal to 0")
        .required("Min picture is required"),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxPicture: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PRICE_TEST,
      then: yup.number()
        .integer("Max picture must be an integer")
        .typeError("Max picture is required")
        .positive("Max picture must be a positive number")
        .required("Max picture is required"),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  numPriceStep: yup.number()
  .when('typeId', {
    is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.PRICE_TEST,
    then: yup.number()
      .integer("Number price step must be an integer")
      .typeError("Number price step is required")
      .positive("Number price step must be a positive number")
      .required("Number price step is required"),
    otherwise: yup.number().empty().notRequired().nullable()
  }),
  daysOfDueDate: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number().integer('Days of payment due date must be an integer.')
        .typeError('Days of payment due date is required.')
        .min(0, 'Days of payment due date must be greater or equal to 0.')
        .required('Days of payment due date is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  daysOfDueDateType: yup.object().shape({
    id: yup.number(),
    name: yup.string()
  })
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.object().shape({
        id: yup.number().required('Type of payment due day is required.'),
        name: yup.string()
      })
        .required('Type of payment due day is required.'),
      otherwise: yup.object().shape({
        id: yup.number(),
        name: yup.string()
      })
        .notRequired()
        .nullable()
    }),
  paymentMonthSchedule: yup.number()
    .when('typeId', {
      is: (typeId: OptionItem) => typeId?.id === ESOLUTION_TYPE.BRAND_TRACKING,
      then: yup.number()
        .typeError('Month schedule is required.')
        .positive('Month schedule must be a positive number.')
        .required('Month schedule is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  enableCustomQuestion: yup.boolean().required('Enable Custom Question is required.'),
  maxCustomQuestion: yup.number()
    .when('enableCustomQuestion', {
      is: (val: number) => !!val,
      then: yup.number()
        .typeError('Max Custom Question is required.')
        .positive('Max Custom Question must be a positive number')
        .required('Max Custom Question is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),

  enableEyeTracking: yup.boolean().required(),
  minEyeTrackingPack: yup.number()
    .when(['enableEyeTracking', 'typeId'], {
      is: (enableEyeTracking: boolean, typeId: OptionItem) => !!enableEyeTracking && typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Min Pack Of Eye Tracking is required.')
        .min(0)
        .integer('Min Pack Of Eye Tracking must be a integer number')
        .required('Min Pack Of Eye Tracking is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  maxEyeTrackingPack: yup.number()
    .when(['enableEyeTracking', 'typeId'], {
      is: (enableEyeTracking: boolean, typeId: OptionItem) => !!enableEyeTracking && typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.number()
        .typeError('Max Pack Of Eye Tracking is required.')
        .positive('Max Pack Of Eye Tracking must be a positive number')
        .required('Max Pack Of Eye Tracking is required.'),
      otherwise: yup.number().empty().notRequired().nullable()
    }),
  eyeTrackingHelp: yup.string()
    .when(['enableEyeTracking', 'typeId'], {
      is: (enableEyeTracking: boolean, typeId: OptionItem) => !!enableEyeTracking && typeId?.id === ESOLUTION_TYPE.PACK,
      then: yup.string()
        .required('Help Of Eye Tracking is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),

  enableHowToSetUpSurvey: yup.boolean().required(),
  howToSetUpSurveyPageTitle: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Page Title is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyDialogTitle: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Dialog Title is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyContent: yup.string()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.string().required('Content is required.'),
      otherwise: yup.string().notRequired().nullable()
    }),
  howToSetUpSurveyFile: yup.mixed()
    .when('enableHowToSetUpSurvey', {
      is: (val: number) => !!val,
      then: yup.mixed().required('PDF is required.'),
      otherwise: yup.mixed().notRequired().nullable()
    }),
    previewQuestionnaireUrl: yup.string().url().notRequired().nullable(),
})

export interface SolutionFormData {
  image: string | File;
  title: string,
  description: string,
  content: string,
  categoryId: OptionItem,
  categoryHomeId: OptionItem,
  typeId: OptionItem,
  minPack: number;
  maxPack: number;
  minVideo: number;
  maxVideo: number;
  minAdditionalBrand: number;
  maxAdditionalBrand: number;
  maxAdditionalAttribute: number;
  minMainBrand: number;
  maxMainBrand: number;
  minCompetingBrand: number;
  maxCompetingBrand: number;
  minCompetitiveBrand: number;
  maxCompetitiveBrand: number;
  minEquityAttributes: number;
  maxEquityAttributes: number;
  minBrandAssetRecognition: number;
  maxBrandAssetRecognition: number;
  minPicture: number,
  maxPicture: number,
  numPriceStep: number,
  daysOfDueDate: number;
  daysOfDueDateType: OptionItem;
  paymentMonthSchedule: number;
  maxCustomQuestion: number;
  enableCustomQuestion: boolean;
  enableEyeTracking: boolean;
  minEyeTrackingPack: number;
  maxEyeTrackingPack: number;
  eyeTrackingHelp: string;
  enableHowToSetUpSurvey: boolean;
  howToSetUpSurveyPageTitle: string;
  howToSetUpSurveyDialogTitle: string;
  howToSetUpSurveyContent: string;
  howToSetUpSurveyFile: FileUpload;
  previewQuestionnaireUrl?: string ;
}

interface SolutionFormProps {
  title: string;
  langEdit?: string;
  itemEdit?: Solution;
  onSubmit: (data: FormData) => void
}

const SolutionForm = memo(({ title, itemEdit, langEdit, onSubmit }: SolutionFormProps) => {

  const dispatch = useDispatch();
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [categoriesHome, setCategoriesHome] = useState<OptionItem[]>([]);
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<SolutionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      enableCustomQuestion: true,
      enableEyeTracking: true,
      enableHowToSetUpSurvey: false
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.solution.root))
  }

  const _onSubmit = (data: SolutionFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('content', data.content)
    formData.append('categoryId', `${data.categoryId.id}`)
    formData.append('typeId', `${data.typeId.id}`)
    formData.append('enableEyeTracking', `${data.enableEyeTracking}`)
    formData.append('previewQuestionnaireUrl', `${data.previewQuestionnaireUrl}`)
    switch (data.typeId.id) {
      case ESOLUTION_TYPE.BRAND_TRACKING:
        formData.append('minMainBrand', `${data.minMainBrand}`)
        formData.append('maxMainBrand', `${data.maxMainBrand}`)
        formData.append('minCompetingBrand', `${data.minCompetingBrand}`)
        formData.append('maxCompetingBrand', `${data.maxCompetingBrand}`)
        formData.append('minCompetitiveBrand', `${data.minCompetitiveBrand}`)
        formData.append('maxCompetitiveBrand', `${data.maxCompetitiveBrand}`)
        formData.append('minEquityAttributes', `${data.minEquityAttributes}`)
        formData.append('maxEquityAttributes', `${data.maxEquityAttributes}`)
        formData.append('minBrandAssetRecognition', `${data.minBrandAssetRecognition}`)
        formData.append('maxBrandAssetRecognition', `${data.maxBrandAssetRecognition}`)
        formData.append('daysOfDueDate', `${data.daysOfDueDate}`)
        formData.append('daysOfDueDateType', `${data.daysOfDueDateType.id}`)
        formData.append('paymentMonthSchedule', `${data.paymentMonthSchedule}`)
        break;
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        formData.append('minVideo', `${data.minVideo}`)
        formData.append('maxVideo', `${data.maxVideo}`)
        break;
      case ESOLUTION_TYPE.PACK:
        formData.append('minPack', `${data.minPack}`)
        formData.append('maxPack', `${data.maxPack}`)
        formData.append('minAdditionalBrand', `${data.minAdditionalBrand}`)
        formData.append('maxAdditionalBrand', `${data.maxAdditionalBrand}`)
        formData.append('maxAdditionalAttribute', `${data.maxAdditionalAttribute}`)
        if (data.enableEyeTracking) {
          formData.append('minEyeTrackingPack', `${data.minEyeTrackingPack}`)
          formData.append('maxEyeTrackingPack', `${data.maxEyeTrackingPack}`)
          formData.append('eyeTrackingHelp', `${data.eyeTrackingHelp}`)
        }
        break;
      case ESOLUTION_TYPE.PRICE_TEST:
        formData.append("minPicture", `${data.minPicture}`)
        formData.append("maxPicture", `${data.maxPicture}`)
        formData.append("numPriceStep", `${data.numPriceStep}`)
        break;
    }
    formData.append('enableCustomQuestion', `${data.enableCustomQuestion}`)
    if (data.enableCustomQuestion) {
      formData.append('maxCustomQuestion', `${data.maxCustomQuestion}`)
    }
    formData.append('enableHowToSetUpSurvey', `${data.enableHowToSetUpSurvey}`)
    formData.append('howToSetUpSurveyPageTitle', data.howToSetUpSurveyPageTitle || '')
    formData.append('howToSetUpSurveyDialogTitle', data.howToSetUpSurveyDialogTitle || '')
    formData.append('howToSetUpSurveyContent', data.howToSetUpSurveyContent || '')
    if (data.image && typeof data.image === 'object') formData.append('image', data.image)
    if (data.howToSetUpSurveyFile?.file) formData.append('howToSetUpSurveyFile', data.howToSetUpSurveyFile.file)
    if (data?.categoryHomeId?.id) formData.append('categoryHomeId', `${data.categoryHomeId.id}`)
    if (langEdit) formData.append('language', langEdit)

    onSubmit(formData)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        image: itemEdit.image,
        title: itemEdit.title,
        description: itemEdit.description,
        content: itemEdit.content,
        typeId: solutionTypes.find(t => t.id === itemEdit.typeId),
        categoryId: itemEdit.category ? { id: itemEdit.category.id, name: itemEdit.category.name } : null,
        categoryHomeId: itemEdit.categoryHome ? { id: itemEdit.categoryHome.id, name: itemEdit.categoryHome.name } : null,
        minPack: itemEdit.minPack,
        maxPack: itemEdit.maxPack,
        minAdditionalBrand: itemEdit.minAdditionalBrand,
        maxAdditionalBrand: itemEdit.maxAdditionalBrand,
        maxAdditionalAttribute: itemEdit.maxAdditionalAttribute,
        minVideo: itemEdit.minVideo,
        maxVideo: itemEdit.maxVideo,
        minMainBrand: itemEdit.minMainBrand,
        maxMainBrand: itemEdit.maxMainBrand,
        minCompetingBrand: itemEdit.minCompetingBrand,
        maxCompetingBrand: itemEdit.maxCompetingBrand,
        minCompetitiveBrand: itemEdit.minCompetitiveBrand,
        maxCompetitiveBrand: itemEdit.maxCompetitiveBrand,
        minEquityAttributes: itemEdit.minEquityAttributes,
        maxEquityAttributes: itemEdit.maxEquityAttributes,
        minBrandAssetRecognition: itemEdit.minBrandAssetRecognition,
        maxBrandAssetRecognition: itemEdit.maxBrandAssetRecognition,
        minPicture: itemEdit.minPicture,
        maxPicture: itemEdit.maxPicture,
        numPriceStep: itemEdit.numPriceStep,
        daysOfDueDate: itemEdit.daysOfDueDate,
        daysOfDueDateType: operationTypes.find((item) => item.id === itemEdit.daysOfDueDateType),
        paymentMonthSchedule: itemEdit.paymentMonthSchedule,
        enableCustomQuestion: itemEdit.enableCustomQuestion,
        maxCustomQuestion: itemEdit.maxCustomQuestion,
        enableEyeTracking: itemEdit.enableEyeTracking,
        minEyeTrackingPack: itemEdit.minEyeTrackingPack,
        maxEyeTrackingPack: itemEdit.maxEyeTrackingPack,
        eyeTrackingHelp: itemEdit.eyeTrackingHelp,
        enableHowToSetUpSurvey: itemEdit.enableHowToSetUpSurvey,
        howToSetUpSurveyPageTitle: itemEdit.howToSetUpSurveyPageTitle || '',
        howToSetUpSurveyDialogTitle: itemEdit.howToSetUpSurveyDialogTitle || '',
        howToSetUpSurveyContent: itemEdit.howToSetUpSurveyContent || '',
        howToSetUpSurveyFile: itemEdit.howToSetUpSurveyFile,
        previewQuestionnaireUrl: itemEdit.previewQuestionnaireUrl,
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      Promise.all([
        AdminSolutionService.getSolutionCategories({ take: 999999 }),
        AdminSolutionService.getSolutionCategoriesHome({ take: 999999 })
      ])
        .then((res) => {
          setCategories((res[0].data as SolutionCategory[]).map((it) => ({ id: it.id, name: it.name })))
          setCategoriesHome((res[1].data as SolutionCategoryHome[]).map((it) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
  }, [dispatch])

  const onRedirectSampleSize = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.solution.sampleSize.root.replace(":solutionId", `${itemEdit.id}`)))
  }

  const onRedirectEyeTrackingSampleSize = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.solution.eyeTrackingSampleSize.root.replace(":solutionId", `${itemEdit.id}`)))
  }

  const type = watch('typeId')

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
        </Typography>
        <Box display="flex" alignContent="center">
          {itemEdit && (
            <>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectSampleSize}
              >
                Sample Size Cost
              </Button>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectEyeTrackingSampleSize}
              >
                Eye Tracking Sample Size Cost
              </Button>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackOutlined />}
          >
            Back
          </Button>
        </Box>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Solution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Grid item xs={12} sm={6}>
                      <TextTitle invalid={errors.image?.message}>Image</TextTitle>
                      <Controller
                        name="image"
                        control={control}
                        render={({ field }) => <UploadImage
                          square
                          file={field.value}
                          errorMessage={errors.image?.message}
                          onChange={(value) => field.onChange(value)}
                        />}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Title"
                      name="title"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Description"
                      name="description"
                      type="text"
                      inputRef={register('description')}
                      errorMessage={errors.description?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextTitle invalid={errors.content?.message}>Content</TextTitle>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => <ReactQuill
                        modules={modules}
                        className={clsx(classes.editor, { [classes.editorError]: !!errors.content?.message })}
                        value={field.value || ''}
                        onBlur={() => field.onBlur()}
                        onChange={(value) => field.onChange(value)}
                      />}
                    />
                    {errors.content?.message && <ErrorMessage>{errors.content?.message}</ErrorMessage>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Category"
                      name="categoryId"
                      control={control}
                      selectProps={{
                        options: categories,
                        placeholder: "Select category",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.categoryId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Category Home"
                      name="categoryHomeId"
                      control={control}

                      selectProps={{
                        options: categoriesHome,
                        placeholder: "Select category home",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.categoryHomeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Type"
                      name="typeId"
                      control={control}
                      selectProps={{
                        options: solutionTypes,
                        placeholder: "Select type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.typeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      fullWidth
                      title="Questionnaire"
                      name="previewQuestionnaireUrl"
                      type="string"
                      inputRef={register('previewQuestionnaireUrl')}
                      disabled={!!langEdit}
                      errorMessage={errors.previewQuestionnaireUrl?.message}
                    />
                  </Grid>
                  {type?.id === ESOLUTION_TYPE.PACK && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Pack"
                          name="minPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minPack')}
                          errorMessage={errors.minPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Pack"
                          name="maxPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxPack')}
                          errorMessage={errors.maxPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Additional Brand"
                          name="minAdditionalBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minAdditionalBrand')}
                          errorMessage={errors.minAdditionalBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Additional Brand"
                          name="maxAdditionalBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxAdditionalBrand')}
                          errorMessage={errors.maxAdditionalBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Additional Attribute"
                          name="maxAdditionalAttribute"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxAdditionalAttribute')}
                          errorMessage={errors.maxAdditionalAttribute?.message}
                        />
                      </Grid>
                    </>
                  )}
                  {type?.id === ESOLUTION_TYPE.VIDEO_CHOICE && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Video"
                          name="minVideo"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minVideo')}
                          errorMessage={errors.minVideo?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Video"
                          name="maxVideo"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxVideo')}
                          errorMessage={errors.maxVideo?.message}
                        />
                      </Grid>
                    </>
                  )}
                  {type?.id === ESOLUTION_TYPE.BRAND_TRACKING && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min main brand"
                          name="minMainBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minMainBrand')}
                          errorMessage={errors.minMainBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Main brand"
                          name="maxMainBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxMainBrand')}
                          errorMessage={errors.maxMainBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min competing brand"
                          name="minCompetingBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minCompetingBrand')}
                          errorMessage={errors.minCompetingBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max competing brand"
                          name="maxCompetingBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxCompetingBrand')}
                          errorMessage={errors.maxCompetingBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min competitive brand"
                          name="minCompetitiveBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minCompetitiveBrand')}
                          errorMessage={errors.minCompetitiveBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max competitive brand"
                          name="maxCompetitiveBrand"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxCompetitiveBrand')}
                          errorMessage={errors.maxCompetitiveBrand?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min equity attribute"
                          name="minEquityAttributes"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minEquityAttributes')}
                          errorMessage={errors.minEquityAttributes?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max equity attribute"
                          name="maxEquityAttributes"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxEquityAttributes')}
                          errorMessage={errors.maxEquityAttributes?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min brand asset recognition"
                          name="minBrandAssetRecognition"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minBrandAssetRecognition')}
                          errorMessage={errors.minBrandAssetRecognition?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max brand asset recognition"
                          name="maxBrandAssetRecognition"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxBrandAssetRecognition')}
                          errorMessage={errors.maxBrandAssetRecognition?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Days of payment due date"
                          name="daysOfDueDate"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('daysOfDueDate')}
                          errorMessage={errors.daysOfDueDate?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputSelect
                          fullWidth
                          title="Type of payment due date"
                          name="daysOfDueDateType"
                          control={control}
                          selectProps={{
                            options: operationTypes,
                            placeholder: "Select type of due date",
                            isDisabled: !!langEdit
                          }}
                          errorMessage={(errors.daysOfDueDateType as any)?.id?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Payment month schedule"
                          name="paymentMonthSchedule"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('paymentMonthSchedule')}
                          errorMessage={errors.paymentMonthSchedule?.message}
                        />
                      </Grid>
                    </>
                  )}
                  {type?.id === ESOLUTION_TYPE.PRICE_TEST && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                            title="Min Picture"
                            name="minPicture"
                            type="number"
                            disabled={!!langEdit}
                            inputRef={register('minPicture')}
                            errorMessage={errors.minPicture?.message}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                            title="Max Picture"
                            name="maxPicture"
                            type="number"
                            disabled={!!langEdit}
                            inputRef={register('maxPicture')}
                            errorMessage={errors.maxPicture?.message}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                            title="Number Price Step"
                            name="numPriceStep"
                            type="number"
                            disabled={!!langEdit}
                            inputRef={register('numPriceStep')}
                            errorMessage={errors.numPriceStep?.message}
                          />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextTitle>Custom Question</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableCustomQuestion"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Enable Custom Question"
                    />
                  </Grid>
                  {watch("enableCustomQuestion") && (
                    <Grid item xs={12} sm={6}>
                      <Inputs
                        title="Max Custom Question"
                        name="maxCustomQuestion"
                        type="number"
                        disabled={!!langEdit}
                        inputRef={register('maxCustomQuestion')}
                        errorMessage={errors.maxCustomQuestion?.message}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextTitle>Eye Tracking</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableEyeTracking"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Enable Eye Tracking"
                    />
                  </Grid>
                  {watch("enableEyeTracking") && type?.id === ESOLUTION_TYPE.PACK && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Pack Of Eye Tracking"
                          name="minEyeTrackingPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minEyeTrackingPack')}
                          errorMessage={errors.minEyeTrackingPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Pack Of Eye Tracking"
                          name="maxEyeTrackingPack"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxEyeTrackingPack')}
                          errorMessage={errors.maxEyeTrackingPack?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextTitle invalid={errors.content?.message}>Help Of Eye Tracking</TextTitle>
                        <Controller
                          name="eyeTrackingHelp"
                          control={control}
                          render={({ field }) => <ReactQuill
                            modules={modules}
                            className={clsx(classes.editor, { [classes.editorError]: !!errors.eyeTrackingHelp?.message })}
                            value={field.value || ''}
                            onBlur={() => field.onBlur()}
                            onChange={(value) => field.onChange(value)}
                          />}
                        />
                        {errors.content?.message && <ErrorMessage>{errors.eyeTrackingHelp?.message}</ErrorMessage>}
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <TextTitle>How to set up survey </TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="enableHowToSetUpSurvey"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                          />}
                        />
                      }
                      label="Enable how to set up survey"
                    />
                  </Grid>
                  {watch("enableHowToSetUpSurvey") && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Page title"
                          name="howToSetUpSurveyPageTitle"
                          inputRef={register('howToSetUpSurveyPageTitle')}
                          errorMessage={errors.howToSetUpSurveyPageTitle?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Dialog title"
                          name="howToSetUpSurveyDialogTitle"
                          inputRef={register('howToSetUpSurveyDialogTitle')}
                          errorMessage={errors.howToSetUpSurveyDialogTitle?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InputTextareaAutosize
                          title="Content"
                          name="howToSetUpSurveyContent"
                          maxRows={100}
                          minRows={10}
                          inputRef={register('howToSetUpSurveyContent')}
                          errorMessage={errors.howToSetUpSurveyContent?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextTitle>PDF</TextTitle>
                        <Controller
                          name="howToSetUpSurveyFile"
                          control={control}
                          render={({ field }) => <UploadFile
                            value={field.value}
                            caption="Allowed pdf"
                            typeInvalidMess="File type must be pdf"
                            fileFormats={['application/pdf']}
                            errorMessage={(errors.howToSetUpSurveyFile as any)?.message}
                            onChange={(value) => field.onChange(value)}
                          />}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  )
})

export default SolutionForm