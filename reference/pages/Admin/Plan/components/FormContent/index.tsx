import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import TextTitle from "components/Inputs/components/TextTitle";
import InputSelect from "components/InputsSelect";
import { push } from "connected-react-router";
import { CreateOrUpdatePlanInput, Plan } from "models/Admin/plan";
import { Solution } from "models/Admin/solution";
import { OptionItem } from "models/general";
import { memo, useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import AdminSolutionService from "services/admin/solution";
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import classes from "./styles.module.scss";
import ParagraphBody from "components/common/text/ParagraphBody";

const schema = yup.object().shape({
  title: yup.string().required('Title is required.'),
  price: yup.number().typeError('Price is required.').positive('Price must be a positive number').required('Price is required.'),
  solutionId: yup.mixed().required('Solution is required.'),
  sampleSize: yup.number().typeError('Sample size is required.').positive('Sample size must be a positive number').required('Sample size is required.'),
  month: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired().positive('Month must be a positive number'),
  content: yup.array(yup.object({
    name: yup.string().required('Content is required.')
  })).required('Content is required.').min(1, 'Content is required.'),
  isMostPopular: yup.boolean().notRequired(),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
})

export interface PlanFormData {
  title: string;
  price: number;
  solutionId: OptionItem;
  sampleSize: number;
  content: {name: string}[];
  isMostPopular: boolean;
  order: number;
  month: number;
}

interface PlanFormDataProps {
  langEdit?: string;
  itemEdit?: Plan;
  onSubmit: (data: CreateOrUpdatePlanInput) => void
}

const FormContent = memo(({ langEdit, itemEdit, onSubmit }: PlanFormDataProps) => {

  const dispatch = useDispatch();

  const [solutions, setSolutions] = useState<Solution[]>([]);

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<PlanFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isMostPopular: false,
      order: 99,
      content: [{
        name: ""
      }]
    }
  });

  const { fields: fieldsContents, append: appendContent, remove: removeContent } = useFieldArray({
    control,
    name: "content"
  });

  const handleBack = () => {
    dispatch(push(routes.admin.plan.root))
  }

  const _onSubmit = (data: PlanFormData) => {
    onSubmit({
      title: data.title,
      price: data.price,
      solutionId: data.solutionId?.id,
      sampleSize: data.sampleSize,
      content: data.content.map(it => it.name),
      isMostPopular: data.isMostPopular,
      month: data.month,
      order: data.order,
      language: langEdit
    })
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        price: itemEdit.price,
        solutionId: itemEdit.solution ? { id: itemEdit.solution.id, name: itemEdit.solution.title } : null,
        sampleSize: itemEdit.sampleSize,
        content: itemEdit.content.map(it => ({ name: it})),
        isMostPopular: itemEdit.isMostPopular,
        month: itemEdit.month,
        order: itemEdit.order,
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = () => {
      AdminSolutionService.getSolutions({ take: 999 })
        .then((res) => {
          setSolutions(res.data.map(it => ({ id: it.id, name: it.title})))
        })
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteAnswer = (index: number) => () => {
    if (fieldsContents?.length <= 1) return
    removeContent(index)
  };

  const onAddContent = () => {
    appendContent({
      name: "",
    })
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? 'Edit Plan' : 'Create Plan'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackOutlined />}
        >
          Back
        </Button>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Plan
                </Typography>
                <Grid container spacing={2}>
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
                      title="Price"
                      name="price"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('price')}
                      errorMessage={errors.price?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      title="Solution"
                      name="solutionId"
                      control={control}
                      selectProps={{
                        options: solutions,
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.solutionId as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Sample size"
                      name="sampleSize"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('sampleSize')}
                      errorMessage={errors.sampleSize?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Month"
                      name="month"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('month')}
                      errorMessage={errors.month?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Order"
                      name="order"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('order')}
                      errorMessage={errors.order?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextTitle>Most popular</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isMostPopular"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Most popular"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}> 
                    <TextTitle>Content</TextTitle> 
                    <Box sx={{ paddingLeft:'5px' }}>
                    {fieldsContents.map((field, index) => (
                      <Grid item xs={12} sm={6} key={field.id}>
                      <Inputs
                        type="text"
                        autoComplete="off"
                        inputProps={{ tabIndex: index + 2 }}
                        inputRef={register(`content.${index}.name`)}
                        errorMessage={errors.content?.[index]?.name?.message}
                        endAdornment={fieldsContents?.length > 1 && (
                          <CloseIcon
                            className={classes.closeInputAnswer}
                            onClick={onDeleteAnswer(index)}
                          />
                        )}
                      />
                    </Grid>
                    ))}
                     <Grid className={classes.addList} item xs={12} sm = {6}>
                      <div onClick={onAddContent} className={classes.addOptions}>
                        <PlaylistAddIcon className={classes.IconListAdd}/>
                        <ParagraphBody $colorName="--eerie-black-65">
                          Click to add content
                        </ParagraphBody>
                      </div>
                  </Grid>
                    </Box>
                  </Grid>
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

export default FormContent