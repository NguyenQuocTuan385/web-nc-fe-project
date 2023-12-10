import { FilterValue } from "components/FilterModal"
import { Plan } from "models/Admin/plan"
import { DataPagination, SortItem } from "models/general"
import { useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const PlanModule = () => {

  const [keyword, setKeyword] = useState<string>('');
  const [filterData, setFilterData] = useState<FilterValue>({
    solutionIds: [],
  });
  const [data, setData] = useState<DataPagination<Plan>>();
  const [sort, setSort] = useState<SortItem>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.plan.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            sort={sort}
            setSort={setSort}
            setData={setData}
            filterData={filterData}
            setFilterData={setFilterData}
          />}
        />
        <Route exact path={routes.admin.plan.create} component={Create} />
        <Route exact path={routes.admin.plan.edit} component={Edit} />

        <Redirect from={routes.admin.plan.root} to={routes.admin.plan.root} />
      </Switch>
    </>
  )
}

export default PlanModule