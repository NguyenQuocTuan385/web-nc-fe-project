import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { AdminEyeTrackingSampleSizeService } from "services/admin/eye_tracking_sample_size"
import EyeTrackingSampleSizeForm, { EyeTrackingSampleSizeFormData } from "../components/EyeTrackingSampleSizeForm"

interface Props {

}

const CreateEyeTrackingSampleSize = memo((props: Props) => {

  const dispatch = useDispatch()
  const { solutionId } = useParams<{ solutionId: string }>();

  const onSubmit = (value: EyeTrackingSampleSizeFormData) => {
    dispatch(setLoading(true))
    AdminEyeTrackingSampleSizeService.create({
      limit: value.limit,
      price: value.price,
      solutionId: Number(solutionId)
    })
      .then(() => {
        dispatch(push(routes.admin.solution.eyeTrackingSampleSize.root.replace(":solutionId", solutionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <EyeTrackingSampleSizeForm
        solutionId={Number(solutionId)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateEyeTrackingSampleSize