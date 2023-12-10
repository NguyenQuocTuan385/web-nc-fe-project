import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import TranslationForm, { TranslationFormData } from "../components/TranslationForm"
import { Translation, UpdateTranslation } from "models/Admin/translation";
import { TranslationService } from "services/admin/translation";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditTranslation = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Translation>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        TranslationService.getTranslation(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: TranslationFormData) => {
    dispatch(setLoading(true))
    const form: UpdateTranslation = {
      key: data.key,
      data: data.data,
      language: data.language.id
    }
    TranslationService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.translation.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <TranslationForm
        title="Edit Translation"
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditTranslation