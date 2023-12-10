import { Translation } from "models/Admin/translation"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const TranslationPage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<Translation>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.translation.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.translation.create} component={Create} />
        <Route exact path={routes.admin.translation.edit} component={Edit} />

        <Redirect from={routes.admin.translation.root} to={routes.admin.translation.root} />
      </Switch>
    </>
  )
})

export default TranslationPage