import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { EPaymentScheduleCancelType } from 'models/payment_schedule';

interface Props {
  type: EPaymentScheduleCancelType,
  className?: string
}

const ProjectCancelType = memo((props: Props) => {

  const { type, className } = props;
  const typeLabel = () => {
    switch (type) {
      case EPaymentScheduleCancelType.AUTO_CANCEL:
        return "Auto cancel"
      case EPaymentScheduleCancelType.USER_CANCEL:
        return "User cancel"
      default: return type;
    }
  };

  return (
    <>
      {
        ![EPaymentScheduleCancelType.NOT_CANCEL].includes(type) && (
          <div
            className={clsx(
              classes.root,
              className,
              classes.red,
            )}
          >
            {typeLabel()}
          </div>
        )
      }
    </>
  );
});
export default ProjectCancelType;
