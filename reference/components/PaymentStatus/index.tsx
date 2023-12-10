import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { EPaymentStatus } from "models/payment";

interface Props {
  status: EPaymentStatus,
  className?: string
}

const PaymentStatus = memo((props: Props) => {
  
  const { status, className } = props;
  const statusLabel = () => {
    switch (status) {
      case EPaymentStatus.FAILED:
        return "Failed"
      case EPaymentStatus.NOT_PAID:
        return "Not paid"
      case EPaymentStatus.PAID:
        return "Paid"
      case EPaymentStatus.CANCEL:
        return "Cancel"
      default: return status;
    }
  };

  return (
    <div
      className={clsx(
        classes.root,
        className,
        status === EPaymentStatus.FAILED && classes.red,
        status === EPaymentStatus.NOT_PAID && classes.gray,
        status === EPaymentStatus.CANCEL && classes.yellow,
        status === EPaymentStatus.PAID && classes.green,
      )}
    >
      {statusLabel()}
    </div>
  );
});
export default PaymentStatus;
