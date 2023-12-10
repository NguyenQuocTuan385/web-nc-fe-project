import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { AdminQuotaService } from "services/admin/quota"
import QuotaTableForm, { QuotaTableFormData } from "../components/QuotaTableForm"

interface Props {

}

const CreateQuotaTable = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: QuotaTableFormData) => {
    dispatch(setLoading(true))
    AdminQuotaService.createQuotaTable({
      title: data.title,
      titleCell: data.titleCell,
      order: data.order,
      questionIds: data.questionIds.map(it => it.id),
      calculations: data.calculations
    })
      .then(() => {
        dispatch(push(routes.admin.quotaTable.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <QuotaTableForm
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateQuotaTable