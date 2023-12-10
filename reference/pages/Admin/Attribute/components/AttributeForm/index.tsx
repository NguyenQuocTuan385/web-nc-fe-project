import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { Solution } from "models/Admin/solution";
import { AttributeCategory } from "models/Admin/attribute";
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
//import classes from './styles.module.scss';
import InputSelect from "components/InputsSelect";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import AdminSolutionService from "services/admin/solution";
import { AdminAttributeService } from "services/admin/attribute";
import { Attribute, attributeTypes, attributeContentTypes, AttributeContentType } from "models/Admin/attribute";

const schema = yup.object().shape({
  solutionId: yup.object().shape({
    id: yup.number().required('Solution is required.'),
    name: yup.string().required()
  }).required(),
  typeId: yup.object().shape({
    id: yup.number().required('Type is required.'),
    name: yup.string().required()
  }).required(),
  categoryId: yup.object().shape({
    id: yup.number(),
    name: yup.string()
  }).nullable(),
  contentTypeId: yup.object().shape({
    id: yup.number().required('Content type is required'),
    name: yup.string().required()
  }).required(),
  start: yup.string().when("contentTypeId", {
    is: (value: OptionItem) => value?.id === AttributeContentType.MULTIPLE,
    then: yup.string().required('Start is required.'),
    otherwise: yup.string()
  }),
  end: yup.string().when("contentTypeId", {
    is: (value: OptionItem) => value?.id === AttributeContentType.MULTIPLE,
    then: yup.string().required('End is required.'),
    otherwise: yup.string()
  }),
  content: yup.string().when("contentTypeId", {
    is: (value: OptionItem) => value?.id === AttributeContentType.SINGLE,
    then: yup.string().required('Content is required.'),
    otherwise: yup.string()
  }),
  order: yup.number().integer('Order is an integer.').typeError('Order is required.').required('Order is required.'),
  code: yup.string().notRequired().nullable(),
})

export interface AttributeFormData {
  solutionId: OptionItem;
  typeId: OptionItem;
  contentTypeId: OptionItem;
  content?: string;
  start?: string;
  end?: string;
  order?: number;
  code?: string;
  categoryId?: OptionItem;
}

interface Props {
  title: string;
  langEdit?: string;
  itemEdit?: Attribute;
  onSubmit: (data: AttributeFormData) => void
}

const AttributeForm = memo(({ title, itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [solutions, setSolutions] = useState<OptionItem[]>([]);
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.attribute.root))
  }

  const resetData = () => {
    reset({
      solutionId: {},
      typeId: {},
      start: "",
      end: "",
      order: null,
      code: null,
      content: "",
      categoryId: null,
      contentTypeId: {}
    })
  }

  const _onSubmit = (data: AttributeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        solutionId: itemEdit.solution ? { id: itemEdit.solution.id, name: itemEdit.solution.title } : null,
        typeId: itemEdit.type ? { id: itemEdit.type.id, name: itemEdit.type.name } : null,
        start: itemEdit.start || "",
        end: itemEdit.end || "",
        order: itemEdit.order,
        code: itemEdit.code,
        content: itemEdit.content || "",
        categoryId: itemEdit.category ? { id: itemEdit.category.id, name: itemEdit.category.name } : null,
        contentTypeId: itemEdit.contentType ? { id: itemEdit.contentType.id, name: itemEdit.contentType.name } : null
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      Promise.all([AdminSolutionService.getSolutions({ take: 9999 }), AdminAttributeService.getAttributeCategories({ take: 9999 })])
        .then(([solutions, categories]) => {
          setSolutions((solutions.data as Solution[]).map((it) => ({ id: it.id, name: it.title })))
          setCategories((categories.data as AttributeCategory[]).map((it) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
  }, [dispatch])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
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
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Attribute
                </Typography>
                <Grid container spacing={2}>
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
                      title="Content type"
                      name="contentTypeId"
                      control={control}
                      selectProps={{
                        options: attributeContentTypes,
                        placeholder: "Select content type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.contentTypeId as any)?.id?.message}
                    />
                  </Grid>
                  {
                    watch("contentTypeId")?.id === AttributeContentType.MULTIPLE && (
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Start"
                          name="start"
                          type="text"
                          inputRef={register('start')}
                          errorMessage={errors.start?.message}
                        />
                      </Grid>
                    )
                  }
                  {
                    watch("contentTypeId")?.id === AttributeContentType.MULTIPLE &&
                    (
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="End"
                          name="end"
                          type="text"
                          inputRef={register('end')}
                          errorMessage={errors.end?.message}
                        />
                      </Grid>
                    )
                  }
                  {
                    watch("contentTypeId")?.id === AttributeContentType.SINGLE &&
                    (
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Content"
                          name="content"
                          type="text"
                          inputRef={register('content')}
                          errorMessage={errors.content?.message}
                        />
                      </Grid>
                    )
                  }

                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Solution"
                      name="solutionId"
                      control={control}
                      selectProps={{
                        options: solutions,
                        placeholder: "Select solution",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.solutionId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Type"
                      name="typeId"
                      control={control}
                      selectProps={{
                        options: attributeTypes,
                        placeholder: "Select type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.typeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Order"
                      name="order"
                      type="text"
                      inputRef={register('order')}
                      disabled={!!langEdit}
                      errorMessage={errors.order?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Code"
                      name="code"
                      type="text"
                      inputRef={register('code')}
                      disabled={!!langEdit}
                      errorMessage={errors.code?.message}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={resetData}
                  >
                    Clear
                  </Button>
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

export default AttributeForm