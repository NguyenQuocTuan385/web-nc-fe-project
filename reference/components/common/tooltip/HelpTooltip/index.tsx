import { Tooltip, Box } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss';
import clsx from 'clsx';
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { HelpOutline as HelpIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface HelpTooltipProps {
    className?: string,
    translationKey: string,
    tooltipPopperClasses?: string
}

const HelpTooltip = memo((props: HelpTooltipProps) => {

    const { className, translationKey, tooltipPopperClasses } = props;
    const { t } = useTranslation()

    return (
        <Tooltip
            placement="right"
            arrow
            className={className}
            classes={{ popper: clsx(classes.tooltipPopper, tooltipPopperClasses) }}
            title={(
                <ParagraphExtraSmall
                    $colorName={"var(--eerie-black)"}
                    variant="caption"
                    translation-key={translationKey}
                    dangerouslySetInnerHTML={{
                        __html: t(translationKey),
                    }}
                >
                </ParagraphExtraSmall>
            )}
        >
            <Box>
                <HelpIcon translation-key={translationKey} sx={{ fontSize: "16px", color: "var(--gray-60)" }} className={classes.helpIcon} />
            </Box>
        </Tooltip>
    )
})

export default HelpTooltip