import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import CreateAnswer from "./Answer/Create"
import EditAnswer from "./Answer/Edit"
import AnswerList from "./Answer/List"
import CreateAnswerGroup from "./AnswerGroup/Create"
import EditAnswerGroup from "./AnswerGroup/Edit"
import AnswerGroupList from "./AnswerGroup/List"
import CreateAnswerSuggestion from "./AnswerSuggestion/Create"
import EditAnswerSuggestion from "./AnswerSuggestion/Edit"
import AnswerSuggestionList from "./AnswerSuggestion/List"
import CreateQuestion from "./Question/Create"
import EditQuestion from "./Question/Edit"
import QuestionList from "./Question/List"

const Target = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.target.question.root} component={QuestionList}/>
        <Route exact path={routes.admin.target.question.create} component={CreateQuestion}/>
        <Route exact path={routes.admin.target.question.edit} component={EditQuestion}/>
        
        <Route exact path={routes.admin.target.question.answer.root} component={AnswerList}/>
        <Route exact path={routes.admin.target.question.answer.create} component={CreateAnswer}/>
        <Route exact path={routes.admin.target.question.answer.edit} component={EditAnswer}/>

        <Route exact path={routes.admin.target.question.answerGroup.root} component={AnswerGroupList}/>
        <Route exact path={routes.admin.target.question.answerGroup.create} component={CreateAnswerGroup}/>
        <Route exact path={routes.admin.target.question.answerGroup.edit} component={EditAnswerGroup}/>

        <Route exact path={routes.admin.target.question.answerSuggestion.root} component={AnswerSuggestionList}/>
        <Route exact path={routes.admin.target.question.answerSuggestion.create} component={CreateAnswerSuggestion}/>
        <Route exact path={routes.admin.target.question.answerSuggestion.edit} component={EditAnswerSuggestion}/>
        
        <Redirect from={routes.admin.target.root} to={routes.admin.target.question.root} />
     </Switch>
    </>
  )
}

export default Target