import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import EmailReminderForm, { EmailReminderFormData } from "../components/EmailReminderForm"
import { EmailReminderService } from "services/admin/email_reminder";
import { EmailReminder, UpdateEmailReminder } from "models/Admin/email_reminder";

interface Props {

}

const EditEmailReminder = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<EmailReminder>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        EmailReminderService.getDetail(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, dispatch])

  const onSubmit = (data: EmailReminderFormData) => {
    dispatch(setLoading(true))
    const form: UpdateEmailReminder = {
      title: data.title,
      numberOfDays: data.numberOfDays,
      isSendUser: data.isSendUser,
      isSendAdmin: data.isSendAdmin
    }
    EmailReminderService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.emailReminder.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <EmailReminderForm
        title="Edit Email Reminder"
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditEmailReminder