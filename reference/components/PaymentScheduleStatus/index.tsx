import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { PaymentScheduleStatus as EPaymentScheduleStatus } from "models/payment_schedule";

interface Props {
    status: EPaymentScheduleStatus,
    className?: string
}

const PaymentScheduleStatus = memo((props: Props) => {

    const { status, className } = props;
    const statusLabel = () => {
        switch (status) {
            case EPaymentScheduleStatus.NOT_PAID:
                return "Not paid"
            case EPaymentScheduleStatus.IN_PROGRESS:
                return "In progress"
            case EPaymentScheduleStatus.OVERDUE:
                return "Overdue"
            case EPaymentScheduleStatus.PAID:
                return "Paid"
            case EPaymentScheduleStatus.CANCEL:
                return "Cancel"
            default: return status;
        }
    };

    return (
        <div
            className={clsx(
                classes.root,
                className,
                status === EPaymentScheduleStatus.OVERDUE && classes.red,
                status === EPaymentScheduleStatus.NOT_PAID && classes.gray,
                status === EPaymentScheduleStatus.CANCEL && classes.red,
                status === EPaymentScheduleStatus.IN_PROGRESS && classes.yellow,
                status === EPaymentScheduleStatus.PAID && classes.green,
            )}
        >
            {statusLabel()}
        </div>
    );
});
export default PaymentScheduleStatus;
