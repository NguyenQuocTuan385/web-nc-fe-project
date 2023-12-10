import { FilterValue } from "components/FilterModal"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import CreateApikey from "./Create"
import EditApikey from "./Edit"
import List from "./List"
import { ApikeyAttributes } from "models/apikey"

interface Props {

}

const ApiKeyPage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [filterData, setFilterData] = useState<FilterValue>({
    userIds: [],
  });
  const [data, setData] = useState<DataPagination<ApikeyAttributes>>();

  return (
    <>
      <Switch>
        <Route
          exact path={routes.admin.apikey.root}
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
        <Route exact path={routes.admin.apikey.create} component={CreateApikey}/>
        <Route exact path={routes.admin.apikey.edit} component={EditApikey}/>
      </Switch>
    </>
  )
})

export default ApiKeyPage