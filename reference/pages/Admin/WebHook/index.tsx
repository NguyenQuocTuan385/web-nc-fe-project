import { FilterValue } from "components/FilterModal"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import List from "./List"
import { Webhook } from "models/Admin/webhook"
import CreateWebhook from "./Create"
import EditWebhook from "./Edit"

interface Props {

}

const WebhookPage = memo((props: Props) => {
  const [keyword, setKeyword] = useState<string>('');
  const [filterData, setFilterData] = useState<FilterValue>({
    eventIds: [],
  });
  const [data, setData] = useState<DataPagination<Webhook>>();

  return (
    <>
      <Switch>
        <Route
          exact path={routes.admin.webhook.root}
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
        <Route exact path={routes.admin.webhook.create} component={CreateWebhook} />
        <Route exact path={routes.admin.webhook.edit} component={EditWebhook} />
      </Switch>
    </>
  )
})

export default WebhookPage