import { Solution } from "models/Admin/solution"
import { DataPagination, SortItem } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import CreateEyeTrackingSampleSize from "./EyeTrackingSampleSize/Create"
import EditEyeTrackingSampleSize from "./EyeTrackingSampleSize/Edit"
import EyeTrackingSampleSizeList from "./EyeTrackingSampleSize/List"
import List from "./List"
import CreateSampleSize from "./SampleSize/Create"
import EditSampleSize from "./SampleSize/Edit"
import SampleSizeList from "./SampleSize/List"

interface Props {

}

const SolutionPage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<Solution>>();
  const [sort, setSort] = useState<SortItem>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.solution.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
            sort={sort}
            setSort={setSort}
          />}
        />
        <Route exact path={routes.admin.solution.create} component={Create} />
        <Route exact path={routes.admin.solution.edit} component={Edit} />

        <Route exact path={routes.admin.solution.sampleSize.root} component={SampleSizeList} />
        <Route exact path={routes.admin.solution.sampleSize.create} component={CreateSampleSize} />
        <Route exact path={routes.admin.solution.sampleSize.edit} component={EditSampleSize} />

        <Route exact path={routes.admin.solution.eyeTrackingSampleSize.root} component={EyeTrackingSampleSizeList} />
        <Route exact path={routes.admin.solution.eyeTrackingSampleSize.create} component={CreateEyeTrackingSampleSize} />
        <Route exact path={routes.admin.solution.eyeTrackingSampleSize.edit} component={EditEyeTrackingSampleSize} />

        <Redirect from={routes.admin.solution.root} to={routes.admin.solution.root} />
      </Switch>
    </>
  )
})

export default SolutionPage