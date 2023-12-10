import { CustomQuestionType } from "models/Admin/custom_question_type"
import { DataPagination } from "models/general"
import { memo, useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import List from "./List"

interface Props {

}

const CustomQuestionTypePage = memo(({ }: Props) => {

  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataPagination<CustomQuestionType>>();

  return (
    <>
      <Switch>
        <Route
          exact
          path={routes.admin.customQuestionType.root}
          render={(props) => <List
            {...props}
            keyword={keyword}
            setKeyword={setKeyword}
            data={data}
            setData={setData}
          />}
        />
        <Route exact path={routes.admin.customQuestionType.edit} component={Edit} />

        <Redirect from={routes.admin.customQuestionType.root} to={routes.admin.customQuestionType.root} />
      </Switch>
    </>
  )
})

export default CustomQuestionTypePage