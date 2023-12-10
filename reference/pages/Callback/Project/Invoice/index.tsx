import { push } from "connected-react-router"
import FileSaver from "file-saver"
import moment from "moment"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { PaymentService } from "services/payment"

interface Params {
  id: string
}

const CallbackInvoice = () => {
  const { id } = useParams<Params>()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!id) return
    const getInvoice = async () => {
      dispatch(setLoading(true))
      PaymentService.getInvoice(Number(id))
        .then(res => {
          FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
        })
        .catch((e) => {
          dispatch(setErrorMess(e))
        })
        .finally(() => {
          dispatch(push(routes.project.detail.paymentBilling.root.replace(':id', id)))
          dispatch(setLoading(false))
        })
    }
    getInvoice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return null
}

export default CallbackInvoice