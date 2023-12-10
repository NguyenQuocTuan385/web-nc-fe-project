import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import ProjectForm from "../components/ProjectForm"
import { Project } from "models/project"
import { AdminProjectService } from "services/admin/project"
import { ESOLUTION_TYPE } from "models/solution";
import ProjectHelper from "helpers/project"

interface Props {

}

const EditProject = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Project>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminProjectService.getProject(Number(id))
          .then((res) => {
            if (ProjectHelper.checkSolutionType(res, [ESOLUTION_TYPE.BRAND_TRACKING], true)) {
              dispatch(push(routes.admin.project.root))
            }
            else {
              setItemEdit(res)
            }
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, dispatch])

  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    AdminProjectService.update(Number(id), data)
      .then(() => {
        dispatch(push(routes.admin.project.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <ProjectForm
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditProject