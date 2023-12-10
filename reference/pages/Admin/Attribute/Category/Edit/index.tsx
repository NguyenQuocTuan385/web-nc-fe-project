import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AdminAttributeService } from "services/admin/attribute"
import AttributeCategoryForm, { AttributeCategoryFormData } from "../components/AttributeCategoryForm"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { AttributeCategory } from "models/Admin/attribute"

interface IQueryString {
  lang?: string
}

interface Props {

}

const Edit = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<AttributeCategory>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminAttributeService.getAttributeCategory(Number(id), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])



  const onSubmit = (data: AttributeCategoryFormData) => {
    dispatch(setLoading(true))
    AdminAttributeService.updateAttributeCategory(Number(id), {
      name: data.name,
      language: lang
    })
      .then(() => {
        dispatch(push(routes.admin.attribute.category.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AttributeCategoryForm
        title={'Update Attribute Category'}
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Edit