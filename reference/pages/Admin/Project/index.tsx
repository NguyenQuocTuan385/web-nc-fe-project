import { FilterValue } from "components/FilterModal"
import { DataPagination, SortItem } from "models/general"
import { Project } from "models/project"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Detail from "./Detail"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const ProjectPage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [sort, setSort] = useState<SortItem>();
  const [filterData, setFilterData] = useState<FilterValue>({
    solutionIds: [],
    statusIds: [],
    orderIds: [],
  });
  const [data, setData] = useState<DataPagination<Project>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.project.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            sort={sort}
            setSort={setSort}
            data={data}
            setData={setData}
            filterData={filterData}
            setFilterData={setFilterData}
          />}
        />
        <Route exact path={routes.admin.project.detail} component={Detail} />
        <Route exact path={routes.admin.project.edit} component={Edit} />

        <Redirect from={routes.admin.project.root} to={routes.admin.project.root} />
      </Switch>
    </>
  )
})

export default ProjectPage