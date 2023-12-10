import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { SortItem, TableHeaderLabel } from "models/general";
import classes from './styles.module.scss';
import clsx from 'clsx';

interface Props {
  className?: string
  headers: TableHeaderLabel[];
  sort?: SortItem;
  onChangeSort?: (name: string) => void;
}

const TableHeader = (props: Props) => {
  const { headers, sort, onChangeSort, className } = props;

  const _onChangeSort = (name: string) => {
    onChangeSort && onChangeSort(name);
  };

  return (
    <TableHead className={clsx(className, classes.tableHead)}>
      <TableRow>
        {
          headers.map(header => (
            <TableCell
              align={header.align || "center"}
              key={header.name}
              className={classes.tableCell}
            >
              {
                header.sortable ?
                  (
                    <TableSortLabel
                      active={sort?.sortedField === header.name}
                      direction={sort?.isDescending ? 'desc' : 'asc'}
                      onClick={() => { _onChangeSort(header.name)}}
                    >
                      {header.label}
                    </TableSortLabel>
                  ) : header.label
              }
            </TableCell>
          ))
        }
      </TableRow>
    </TableHead>
  )
}

export default TableHeader