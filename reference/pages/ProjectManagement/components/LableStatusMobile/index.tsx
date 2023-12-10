import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { ProjectStatus } from "models/project";
import { useTranslation } from "react-i18next";

interface LabelStatusMobileProps {
  typeStatus: ProjectStatus,
}

const LabelStatusMobile = memo((props: LabelStatusMobileProps) => {
  const { t } = useTranslation()

  const statusLabel = () => {
    switch (typeStatus) {
      case ProjectStatus.AWAIT_PAYMENT:
        return t('project_status_await_payment')
      case ProjectStatus.DRAFT:
        return t('project_status_draft')
      case ProjectStatus.IN_PROGRESS:
        return t('project_status_in_progress')
      case ProjectStatus.COMPLETED:
        return t('project_status_completed')
      default: return typeStatus;
    }
  };
  const { typeStatus, ...rest } = props;

  return (
    <div
      className={clsx(
        classes.root,
        typeStatus === ProjectStatus.AWAIT_PAYMENT ? classes.red : "",
        typeStatus === ProjectStatus.DRAFT ? classes.gray : "",
        typeStatus === ProjectStatus.IN_PROGRESS ? classes.yellow : "",
        typeStatus === ProjectStatus.COMPLETED ? classes.green : "",
      )
      }
      {...rest}
    >
      <div/><p>{statusLabel()}</p>
    </div >
  );
});
export default LabelStatusMobile;
