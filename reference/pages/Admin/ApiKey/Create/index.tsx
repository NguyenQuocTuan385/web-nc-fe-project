import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import ApikeyForm from "../components/ApikeyForm"
import { AdminApikeyService } from "services/admin/apikey"

export interface ApikeyFormData {
  id: number;
  name: string;
  key: string;
  description?: string;
  expiredTime: Date;
}
interface Props {

}

const CreateApikey = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: ApikeyFormData) => {
   dispatch(setLoading(true))
   AdminApikeyService.create(data)
      .then(() => {
        dispatch(push(routes.admin.apikey.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false))) 
  }

  return (
    <>
      <ApikeyForm
        title="Create API Key"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateApikey