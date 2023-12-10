import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { AdminEyeTrackingSampleSizeService } from "services/admin/eye_tracking_sample_size";
import EyeTrackingSampleSizeForm, { EyeTrackingSampleSizeFormData } from "../components/EyeTrackingSampleSizeForm"
import { EyeTrackingSampleSize } from "models/Admin/eye_tracking_sample_size"

interface Props {

}

const EditEyeTrackingSampleSize = memo((props: Props) => {

  const dispatch = useDispatch()
  const { solutionId, sampleSizeId } = useParams<{ solutionId: string, sampleSizeId: string }>();
  const [itemEdit, setItemEdit] = useState<EyeTrackingSampleSize>(null);

  useEffect(() => {
    if (sampleSizeId && !isNaN(Number(sampleSizeId))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminEyeTrackingSampleSizeService.getDetail(Number(sampleSizeId))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [sampleSizeId, dispatch])

  const onSubmit = (data: EyeTrackingSampleSizeFormData) => {
    dispatch(setLoading(true))
    AdminEyeTrackingSampleSizeService.update(Number(sampleSizeId), {
      limit: data.limit,
      price: data.price
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
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditEyeTrackingSampleSize