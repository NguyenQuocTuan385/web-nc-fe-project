import { FilterValue } from "components/FilterModal"
import { DataPagination } from "models/general"
import { User } from "models/user"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const UserPage = memo(({ }: Props) => {
  const [keyword, setKeyword] = useState<string>('');
  const [filterData, setFilterData] = useState<FilterValue>({
    countryIds: [],
  });
  const [data, setData] = useState<DataPagination<User>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.user.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
            filterData={filterData}
            setFilterData={setFilterData}
          />}
        />
        <Route exact path={routes.admin.user.create} component={Create} />
        <Route exact path={routes.admin.user.edit} component={Edit} />

        <Redirect from={routes.admin.user.root} to={routes.admin.user.root} />
      </Switch>
    </>
  )
})

export default UserPage