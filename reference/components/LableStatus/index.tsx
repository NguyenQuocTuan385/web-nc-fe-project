import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { ProjectStatus } from "models/project";
import { useTranslation } from "react-i18next";
import { ESOLUTION_TYPE } from 'models/solution';
interface LabelStatusProps {
  typeStatus: ProjectStatus,
  className?: string,
  solutionTypeId?:number
}

const LabelStatus = memo((props: LabelStatusProps) => {
  const { t } = useTranslation()
  const { typeStatus, className, solutionTypeId } = props;

  const statusLabel = () => {
    switch (typeStatus) {
      case ProjectStatus.AWAIT_PAYMENT:
        return t('project_status_await_payment')
      case ProjectStatus.DRAFT:
        return t('project_status_draft')
      case ProjectStatus.IN_PROGRESS:
        return t('project_status_in_progress')
      case ProjectStatus.COMPLETED:
        return t("project_status_completed")
      default: return typeStatus;
    }
  };

  return (
    <div
      className={clsx(
        classes.root,
        className,
        typeStatus === ProjectStatus.AWAIT_PAYMENT ? classes.red : "",
        typeStatus === ProjectStatus.DRAFT ? classes.gray : "",
        typeStatus === ProjectStatus.IN_PROGRESS ? classes.green  : "",
        typeStatus === ProjectStatus.COMPLETED ? classes.green : "",
      )}
    >
      {statusLabel()}
    </div>
  );
});
export default LabelStatus;
