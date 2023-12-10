import { Chip, ChipProps, Tooltip } from "@mui/material";
import clsx from "clsx";
import Heading6 from "components/common/text/Heading6";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import { ProjectStatus } from "models/project";
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next";
import classes from './styles.module.scss';
import { ESOLUTION_TYPE } from "models/solution";


interface ProjectStatusProps extends ChipProps {
  status: ProjectStatus
  solutionTypeId: number;
}

export const ChipProjectStatus = memo(({ status, className, solutionTypeId,  ...rest }: ProjectStatusProps) => {
  const { t } = useTranslation()
  const statusLabel = useMemo(() => {
    switch (status) {
      case ProjectStatus.AWAIT_PAYMENT:
        return t('project_status_await_payment')
      case ProjectStatus.DRAFT:
        return t('project_status_draft')
      case ProjectStatus.IN_PROGRESS:
        return t('project_status_in_progress')
      case ProjectStatus.COMPLETED:
        return t("project_status_completed")
    }
  }, [status]);

  const statusContent = useMemo(() => {
    switch (status) {
      case ProjectStatus.AWAIT_PAYMENT:
        return t('project_status_await_payment_content')
      case ProjectStatus.DRAFT:
        return t('project_status_draft_content')
      case ProjectStatus.IN_PROGRESS:
        return t('project_status_in_progress_content')
      case ProjectStatus.COMPLETED:
        return t('project_status_completed_content')
    }
  }, [status]);

  return (
    <BasicTooltip
      arrow
      title={(
        <>
          <Heading6 mb={0.5} translation-key="project_status"> {t('project_status')}</Heading6>
          <ParagraphExtraSmall $colorName="--gray-02" variant="caption" sx={{ fontWeight: "500 !important" }}>{statusLabel}: </ParagraphExtraSmall>
          <ParagraphExtraSmall $colorName="--gray-02" variant="caption">{statusContent}</ParagraphExtraSmall>
        </>
      )}
    >
      <Chip
        label={statusLabel}
        {...rest}
        className={clsx(
          classes.root,
          className,
          {
            [classes.draft]: ProjectStatus.DRAFT === status,
            [classes.awaitPayment]: ProjectStatus.AWAIT_PAYMENT === status,
            [classes.inProcess]: ProjectStatus.IN_PROGRESS === status,
            [classes.completed]: ProjectStatus.COMPLETED === status
          }
        )}
      />
    </BasicTooltip>

  )
})

export default ChipProjectStatus