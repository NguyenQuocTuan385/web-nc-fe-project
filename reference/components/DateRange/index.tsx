import classes from "./styles.module.scss";
import { memo, useState } from "react";
import Inputs from "components/Inputs";
import moment from "moment";
import { Popover } from "@mui/material";
import {
  DateRange as ReactDateRange,
  Range,
  RangeFocus,
} from "react-date-range";

export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeProps {
  dateRange: IDateRange;
  onChange: (value: Range) => void;
}

const DateRange = memo((props: DateRangeProps) => {
  const { dateRange, onChange } = props;
  const [anchorDateRange, setAnchorDateRange] =
    useState<HTMLButtonElement | null>(null);

  const handleOpenPopupDateRange = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    setAnchorDateRange(event.currentTarget);
  };

  return (
    <div className={classes.dateRange}>
      <div className={classes.dateInput}>
        <p className={classes.dateInputTitle}>Start date</p>
        <Inputs
          readOnly
          value={
            dateRange?.startDate
              ? moment(dateRange?.startDate).format("DD/MM/YYYY")
              : ""
          }
          placeholder="From..."
          onClick={handleOpenPopupDateRange}
        />
      </div>
      <div className={classes.dateInput}>
        <p className={classes.dateInputTitle}>End date</p>
        <Inputs
          readOnly
          value={
            dateRange?.endDate
              ? moment(dateRange?.endDate).format("DD/MM/YYYY")
              : ""
          }
          placeholder="To..."
          onClick={handleOpenPopupDateRange}
        />
      </div>
      <Popover
        open={Boolean(anchorDateRange)}
        anchorEl={anchorDateRange}
        onClose={() => setAnchorDateRange(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ReactDateRange
          editableDateInputs={true}
          startDatePlaceholder="From..."
          endDatePlaceholder="To..."
          rangeColors={["#1f61a9"]}
          ranges={[
            {
              startDate: dateRange?.startDate,
              endDate: dateRange?.endDate,
              key: "selection",
            },
          ]}
          onChange={(item) => {
            onChange(item.selection as Range);
          }}
          onRangeFocusChange={(item: RangeFocus) => {
            if (item[0] === 0 && item[1] === 0) {
              setAnchorDateRange(null);
            }
          }}
        />
      </Popover>
    </div>
  );
});

export default DateRange;
