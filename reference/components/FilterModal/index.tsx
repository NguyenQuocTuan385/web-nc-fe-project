import { memo } from "react";
import classes from "./styles.module.scss";
import { OptionItemT } from "models/general";
import clsx from "clsx";
import InputCreatableSelect from "components/InputCreatableSelect";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog, Grid, IconButton } from "@mui/material";
import Images from "config/images";
import Buttons from "components/Buttons";
import DateRange, { IDateRange } from "../DateRange";
import { Range } from "react-date-range";

export enum EFilterType {
  SELECT = "SELECT",
  DATE_RANGE = "DATE_RANGE",
}

export interface FilterOption {
  name: string;
  key: string;
  type: EFilterType;
  creatable?: boolean;
  placeholder?: string;
}

export type ValueType = OptionItemT<any>[] | Range;

export interface FilterValue {
  [key: string]: ValueType;
}

export interface CurrentValue extends FilterOption {
  value: ValueType;
}

interface FilderModalProps {
  isOpen: boolean;
  filterOptions: FilterOption[];
  filterValue: FilterValue;
  bindLabel?: string,
  onClose: () => void;
  getFilterOption: (name: string) => OptionItemT<any>[];
  onChange: (filterValue: FilterValue) => void;
}

const FilderModal = memo(
  ({
    isOpen,
    filterOptions,
    filterValue,
    bindLabel,
    onClose,
    getFilterOption,
    onChange,
  }: FilderModalProps) => {
    const [currentValue, setCurrentValue] = useState<CurrentValue[]>([]);

    const handleClose = () => {
      onClose();
    };

    const initOption = (type: EFilterType) => {
      switch (type) {
        case EFilterType.SELECT:
          return [];
        case EFilterType.DATE_RANGE:
          const range: Range = {
            startDate: null,
            endDate: null,
          };
          return range;
      }
    };

    const isValidData = (type: EFilterType, value: ValueType) => {
      switch (type) {
        case EFilterType.SELECT:
          return !!(value as OptionItemT<any>[])?.length;
        case EFilterType.DATE_RANGE:
          return !!(value as Range)?.startDate || !!(value as Range)?.endDate;
      }
    };

    useEffect(() => {
      if (!isOpen) return;
      const value: CurrentValue[] = [];
      Object.keys(filterValue).forEach((key) => {
        const item = filterOptions?.find((it) => it.key === key);
        if (item && isValidData(item.type, filterValue[key])) {
          value.push({
            ...item,
            value: filterValue[key],
          });
        }
      });
      if (!value.length) {
        value.push({
          ...filterOptions[0],
          value: initOption(EFilterType.SELECT),
        });
      }
      setCurrentValue(value);
    }, [filterValue, filterOptions, isOpen]);

    const onChangeFilter = (item: FilterOption) => {
      let currentValueNew = [...currentValue];
      const i = currentValueNew.findIndex((it) => it.key === item.key);
      if (i !== -1) {
        currentValueNew = currentValueNew.filter(
          (temp) => temp.key !== item.key
        );
      } else {
        currentValueNew = [...currentValueNew, { ...item, value: [] }];
      }
      currentValueNew = currentValueNew.filter(
        (temp) => temp.key === item.key || isValidData(temp.type, temp.value)
      );
      if (!currentValueNew.length) {
        currentValueNew = [
          {
            ...filterOptions[0],
            value: initOption(filterOptions[0].type),
          },
        ];
      }
      setCurrentValue(currentValueNew);
    };

    const _onChange = () => {
      const value: FilterValue = {};
      filterOptions.forEach((option) => {
        const item = currentValue.find((it) => it.key === option.key);
        value[option.key] = item?.value || [];
      });
      onChange && onChange(value);
      handleClose();
    };

    const renderFilter = () => {
      return (
        <>
          {currentValue?.map((item, i) => {
            switch (item.type) {
              case EFilterType.SELECT:
                return (
                  <div className={classes.filterValueItem} key={i}>
                    <InputCreatableSelect
                      fullWidth
                      title={item.name}
                      creatable={!!item.creatable}
                      bindLabel={bindLabel || null}
                      selectProps={{
                        value: item.value,
                        menuPosition: "fixed",
                        options: getFilterOption(item.key) || [],
                        isClearable: true,
                        isMulti: true,
                        placeholder: item.placeholder,
                        onChange: (value: OptionItemT<any>[]) => {
                          const currentValueNew = [...currentValue];
                          currentValueNew[i].value = value;
                          setCurrentValue(currentValueNew);
                        },
                      }}
                    />
                  </div>
                );
              case EFilterType.DATE_RANGE:
                return (
                  <DateRange
                    dateRange={item.value as IDateRange}
                    onChange={(value: Range) => {
                      const currentValueNew = [...currentValue];
                      currentValueNew[i].value = {
                        startDate: value?.startDate,
                        endDate: value?.endDate,
                      };
                      setCurrentValue(currentValueNew);
                    }}
                    key={i}
                  />
                );
              default:
                return <></>;
            }
          })}
        </>
      );
    };

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{ paper: classes.paper }}
      >
        <Grid className={classes.root}>
          <Grid className={classes.header}>
            <p className={classes.title}>Please select search filter(s): </p>
            <IconButton onClick={handleClose}>
              <img src={Images.icClose} alt="" />
            </IconButton>
          </Grid>
          <Grid className={classes.body}>
            <div className={classes.filterOption}>
              {filterOptions.map((item, i) => (
                <div
                  onClick={() => onChangeFilter(item)}
                  className={clsx(classes.filterOptionItem, {
                    [classes.filterOptionItemActive]: !!currentValue?.find(
                      (it) => it.key === item.key
                    ),
                  })}
                  key={i}
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className={classes.filterValue}>{renderFilter()}</div>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons
              onClick={_onChange}
              children={"Go"}
              btnType="Blue"
              padding="10px 16px"
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
);

export default FilderModal;
