import { Box, Stack, Step, StepLabelProps } from '@mui/material';
import {
	RPStepConnector,
	RPStepContent,
	RPStepIconBox,
	RPStepLabel,
	RPStepper,
} from '..';
import { useTranslation } from 'react-i18next';
import { RPStepSubtitle, RPStepTitle } from './components';
import { StringMap, TOptions } from 'i18next';

interface StepItem {
	active: boolean;
	number?: number;
	title: string;
	titleOption?: string | TOptions<StringMap>;
	subTitle?: string;
	subtitleOption?: string | TOptions<StringMap>;
	labelProps: StepLabelProps;
	content?: React.ReactNode;
	optional?: boolean;
}
interface RightPanelStepperProps {
	steps: StepItem[];
}

export const RightPanelStepper = ({ steps }: RightPanelStepperProps) => {
	const { t } = useTranslation();
	return (
		<RPStepper orientation="vertical" connector={<RPStepConnector />}>
			{steps.map((step, index) => {
				return (
					<Step key={index} active={step.active} expanded>
						<RPStepLabel
							sx={{ py: 0.5 }}
							StepIconComponent={({ active }) => (
								<RPStepIconBox $active={active}>{index + 1}</RPStepIconBox>
							)}
							{...step.labelProps}>
							<RPStepTitle className="title" translation-key={step.title}>
								{t(step.title, step.titleOption)}
							</RPStepTitle>

						<Stack direction="row" alignItems="center">
							{step.optional && (
								<RPStepSubtitle translation-key="common_optional_upper">
									{t("common_optional_upper")}
								</RPStepSubtitle>
							)}
							{step.subTitle && (
								<RPStepSubtitle $overflow translation-key={step.subTitle}>
									{step.optional && <>&nbsp;-&nbsp;</>}
									{t(step.subTitle, step.subtitleOption)}
								</RPStepSubtitle>
							)}
						</Stack>
						</RPStepLabel>

						<RPStepContent>
                            {!!step.content && (<Box mt={0.45}>{step.content}</Box>)}
						</RPStepContent>
					</Step>
				);
			})}
		</RPStepper>
	);
};
