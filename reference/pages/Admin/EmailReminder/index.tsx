import { EmailReminder } from "models/Admin/email_reminder"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import Create from "./Create"
import List from "./List"

interface Props {

}

const EmailReminderPage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<EmailReminder>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.emailReminder.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.emailReminder.edit} component={Edit} />
        <Route exact path={routes.admin.emailReminder.create} component={Create} />

        <Redirect from={routes.admin.emailReminder.root} to={routes.admin.emailReminder.root} />
      </Switch>
    </>
  )
})

export default EmailReminderPage