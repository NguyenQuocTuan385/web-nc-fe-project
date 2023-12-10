import { EmailTemplate } from "models/Admin/email_template"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const EmailTemplatePage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<EmailTemplate>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.emailTemplate.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.emailTemplate.edit} component={Edit} />

        <Redirect from={routes.admin.emailTemplate.root} to={routes.admin.emailTemplate.root} />
      </Switch>
    </>
  )
})

export default EmailTemplatePage