import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import EmailReminderForm, { EmailReminderFormData } from "../components/EmailReminderForm"
import { EmailReminderService } from "services/admin/email_reminder";
import { UpdateEmailReminder } from "models/Admin/email_reminder";


interface Props {

}

const CreateEmailReminder = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: EmailReminderFormData) => {
    dispatch(setLoading(true))
    const form: UpdateEmailReminder = {
      title: data.title,
      numberOfDays: data.numberOfDays,
      isSendUser: data.isSendUser,
      isSendAdmin: data.isSendAdmin
    }
    EmailReminderService.create(form)
      .then(() => {
        dispatch(push(routes.admin.emailReminder.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <EmailReminderForm
        title="Create Email Reminder"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateEmailReminder