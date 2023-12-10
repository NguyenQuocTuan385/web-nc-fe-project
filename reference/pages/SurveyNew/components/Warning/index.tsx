import { Project, ProjectStatus } from "models/project"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import classes from './styles.module.scss'

interface Props {
  project: Project
}

const Warning = memo(({ project }: Props) => {

  const { t } = useTranslation()

  const getMess = () => {
    if (!project) return
    switch (project?.status) {
      case ProjectStatus.AWAIT_PAYMENT:
        return <span translation-key="project_cannot_edit_await_payment">{t('project_cannot_edit_await_payment')}</span>
      case ProjectStatus.COMPLETED:
        return <span translation-key="project_cannot_edit_completed">{t('project_cannot_edit_completed')}</span>
      case ProjectStatus.IN_PROGRESS:
        return <span translation-key="project_cannot_edit_in_progress">{t('project_cannot_edit_in_progress')}</span>
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {getMess()}
      </div>
    </div>
  )
})

export default Warning