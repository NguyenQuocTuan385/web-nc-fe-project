import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { TranslationService } from "services/admin/translation"
import TranslationForm, { TranslationFormData } from "../components/TranslationForm"

interface Props {

}

const CreateTranslation = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: TranslationFormData) => {
    dispatch(setLoading(true))
    TranslationService.create({
      key: data.key,
      data: data.data,
      language: data.language.id
    })
      .then(() => {
        dispatch(push(routes.admin.translation.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <TranslationForm
        title="Create Translation"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateTranslation