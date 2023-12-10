import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import ApikeyForm from "../components/ApikeyForm"
import { Apikey } from "models/Admin/apikey";
import { ApikeyFormData } from "../Create";
import { AdminApikeyService } from "services/admin/apikey";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditApikey = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Apikey>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminApikeyService.getApikey(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: ApikeyFormData) => {
    dispatch(setLoading(true))
    AdminApikeyService.update(itemEdit.id,data)
      .then(() => {
        dispatch(push(routes.admin.apikey.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false))) 
  }

  return (
    <>
      <ApikeyForm
        title="Edit API Key"
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditApikey