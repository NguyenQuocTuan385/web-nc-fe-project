import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { AdminAttributeService } from "services/admin/attribute"
import AttributeCategoryForm, { AttributeCategoryFormData } from "../components/AttributeCategoryForm"

interface Props {

}

const Create = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: AttributeCategoryFormData) => {
    dispatch(setLoading(true))
    AdminAttributeService.createAttributeCategory({
      name: data.name
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
        title={'Create Attribute Category'}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Create