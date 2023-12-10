import { Box, SvgIconProps } from "@mui/material";
import clsx from "clsx";
import Heading6 from "components/common/text/Heading6";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
// eslint-disable-next-line no-useless-rename
import { ProjectStatus as ProjectStatus } from "models/project";
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next";
import classes from './styles.module.scss';
import IconLockOutline from 'components/icons/IconLockOutline';

interface LockIconProps extends SvgIconProps {
  status: ProjectStatus
}

export const LockIcon = memo(({ status, className, ...rest }: LockIconProps) => {

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
        return t('project_status_completed')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <BasicTooltip
      arrow
      title={(
        <>
          <Heading6 mb={0.5} translation-key="project_lock_icon_title">{t("project_lock_icon_title")}</Heading6>
          <ParagraphExtraSmall $colorName="--gray-02" variant="caption" 
          translation-key="project_lock_icon_content"
          dangerouslySetInnerHTML={{
            __html: t("project_lock_icon_content", {statusLabel: statusLabel}),
          }}
          className={classes.lockIconContent}
          >
          </ParagraphExtraSmall>
        </>
      )}
    >
      <Box className={classes.root}>
        <IconLockOutline
          {...rest}
          className={clsx(classes.icon, className,)}
        />
      </Box>

    </BasicTooltip>

  )
})

export default LockIcon