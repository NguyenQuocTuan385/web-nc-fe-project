import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import WebhookForm from "../components/WebHookForm"
import { WebHookFormData } from "../Create";
import { AdminWebHookService } from "services/admin/webhook";
import { WebhookData } from "models/Admin/webhook";


interface Props {

}

const EditWebhook = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminWebHookService.getWebHook(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, dispatch])

  const onSubmit = (data: WebHookFormData) => {
    dispatch(setLoading(true))

    const dataSubmit: WebhookData = {
      eventId: data.event.id,
      url: data.url,
      description: data.description
    }

    AdminWebHookService.update(itemEdit.id, dataSubmit)
      .then(() => {
        dispatch(push(routes.admin.webhook.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <WebhookForm
        title="Edit Webhook"
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditWebhook