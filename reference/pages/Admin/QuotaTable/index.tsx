import { QuotaTable } from "models/Admin/quota"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const QuotaTablePage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<QuotaTable>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.quotaTable.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.quotaTable.create} component={Create} />
        <Route exact path={routes.admin.quotaTable.edit} component={Edit} />

        <Redirect from={routes.admin.quotaTable.root} to={routes.admin.quotaTable.root} />
      </Switch>
    </>
  )
})

export default QuotaTablePage