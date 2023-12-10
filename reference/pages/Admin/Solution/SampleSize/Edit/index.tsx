import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import SampleSizeForm, { SampleSizeFormData } from "../components/SampleSizeForm"
import { SampleSize } from "models/Admin/sample_size";
import { AdminSampleSizeService } from "services/admin/sample_size";

interface Props {

}

const EditSampleSize = memo((props: Props) => {

  const dispatch = useDispatch()
  const { solutionId, sampleSizeId } = useParams<{ solutionId: string, sampleSizeId: string }>();
  const [itemEdit, setItemEdit] = useState<SampleSize>(null);

  useEffect(() => {
    if (sampleSizeId && !isNaN(Number(sampleSizeId))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminSampleSizeService.getDetail(Number(sampleSizeId))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [sampleSizeId, dispatch])

  const onSubmit = (data: SampleSizeFormData) => {
    dispatch(setLoading(true))
    AdminSampleSizeService.update(Number(sampleSizeId), {
      limit: data.limit,
      price: data.price
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
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditSampleSize