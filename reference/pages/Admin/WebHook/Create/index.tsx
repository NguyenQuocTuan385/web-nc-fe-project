import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { AdminWebHookService } from "services/admin/webhook"
import { OptionItem } from "models/general"
import { WebhookData } from "models/Admin/webhook"
import WebhookForm from "../components/WebHookForm"

export interface WebHookFormData {
  id: number;
  event: OptionItem;
  url: string;
  description: string;
}
interface Props {

}

const CreateWebhook = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: WebHookFormData) => {
    dispatch(setLoading(true))

    const dataSubmit: WebhookData = {
      eventId: data.event.id,
      url: data.url,
      description: data.description
    }

    AdminWebHookService.create(dataSubmit)
      .then(() => {
        dispatch(push(routes.admin.webhook.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <WebhookForm
        title="Create Webhook"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateWebhook