import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { AdminSampleSizeService } from "services/admin/sample_size"
import SampleSizeForm, { SampleSizeFormData } from "../components/SampleSizeForm"

interface Props {

}

const CreateSampleSize = memo((props: Props) => {

  const dispatch = useDispatch()
  const { solutionId } = useParams<{ solutionId: string }>();

  const onSubmit = (value: SampleSizeFormData) => {
    dispatch(setLoading(true))
    AdminSampleSizeService.create({
      limit: value.limit,
      price: value.price,
      solutionId: Number(solutionId)
    })
      .then(() => {
        dispatch(push(routes.admin.solution.sampleSize.root.replace(":solutionId", solutionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <SampleSizeForm
        solutionId={Number(solutionId)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateSampleSize