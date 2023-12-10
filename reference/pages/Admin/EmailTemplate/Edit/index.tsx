import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import EmailTemplateForm, { EmailTemplateFormData } from "../components/EmailTemplateForm"
import { EmailTemplateService } from "services/admin/email_template";
import { EmailTemplate, UpdateEmailTemplate } from "models/Admin/email_template";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditEmailTemplate = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<EmailTemplate>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        EmailTemplateService.getDetail(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: EmailTemplateFormData) => {
    dispatch(setLoading(true))
    const form: UpdateEmailTemplate = {
      subject: data.subject,
      content: data.content,
      emailsTo: data.emailsTo?.map(it => it.id),
      isEmailOwner: !!data.isEmailOwner,
      isEmailEditor: !!data.isEmailEditor,
      isEmailUserMakeOrder: !!data.isEmailUserMakeOrder,
    }
    EmailTemplateService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.emailTemplate.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <EmailTemplateForm
        title="Edit email template"
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditEmailTemplate