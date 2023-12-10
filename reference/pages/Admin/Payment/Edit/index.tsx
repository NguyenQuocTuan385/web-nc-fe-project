import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import PaymentForm, { PaymentFormData } from "../components/PaymentForm"
import { AdminPaymentService } from "services/admin/payment"
import { Payment } from "models/payment"
import { UpdatePayment } from "models/Admin/payment"

interface Props {

}

const EditPayment = memo(({ }: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Payment>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminPaymentService.getPayment(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, dispatch])

  const onSubmit = (data: PaymentFormData) => {
    dispatch(setLoading(true))
    const form: UpdatePayment = {
      fullName: data.fullName,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      email: data.email,
      phone: data.phone,
      countryId: data.countryId.id,
      taxCode: data.taxCode || '',
      sampleSizeCost: data.sampleSizeCost,
      sampleSizeCostUSD: data.sampleSizeCostUSD,
      customQuestionCost: data.customQuestionCost || 0,
      customQuestionCostUSD: data.customQuestionCostUSD || 0,
      eyeTrackingSampleSizeCost: data.eyeTrackingSampleSizeCost || 0,
      eyeTrackingSampleSizeCostUSD: data.eyeTrackingSampleSizeCostUSD || 0,
      amount: data.amount,
      amountUSD: data.amountUSD,
      vat: data.vat,
      vatUSD: data.vatUSD,
      totalAmount: data.totalAmount,
      totalAmountUSD: data.totalAmountUSD
    }
    AdminPaymentService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.payment.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <PaymentForm
      itemEdit={itemEdit}
      onSubmit={onSubmit}
    />
  )
})

export default EditPayment