import { Attribute } from "models/Admin/attribute"
import { DataPagination, SortItem } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"
import Category from "./Category";
interface Props {

}

const AttributePage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<Attribute>>();
  const [sort, setSort] = useState<SortItem>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.attribute.root}
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
        <Route exact path={routes.admin.attribute.create} component={Create} />
        <Route exact path={routes.admin.attribute.edit} component={Edit} />
        <Route path={routes.admin.attribute.category.root} component={Category} />

        <Redirect from={routes.admin.attribute.root} to={routes.admin.attribute.root} />
      </Switch>
    </>
  )
})

export default AttributePage