import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";

interface TableTemplateProps {
  data: Array<{ [key: string]: any }>;
  customHeading: string[];
  customColumns: string[];
  isActionColumn: boolean;
}

function TableTemplate({ data, customHeading, customColumns, isActionColumn }: TableTemplateProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='custom table'>
        <TableHead className={classes["table-head"]}>
          <TableRow>
            {/* Custom heading */}
            {customHeading.map((heading, index) => (
              <TableCell key={index} align='center' className={classes["table-cell"]}>
                {heading}
              </TableCell>
            ))}
            {/* Action column heading */}
            {isActionColumn && (
              <TableCell align='center' className={classes["table-cell"]}>
                Hành động
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {customColumns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  align='center'
                  className={`${classes["col-table-body"]} ${
                    column === "planning" ? (row[column] ? `${classes["active"]}` : `${classes["inactive"]} }`) : ""
                  }`}
                >
                  {column === "planning" ? (row[column] ? "Đã quy hoạch" : "Chưa quy hoạch") : row[column]}
                </TableCell>
              ))}

              {/* Action column */}
              {isActionColumn && (
                <TableCell align='center'>
                  <IconButton aria-label='edit' size='medium'>
                    <FontAwesomeIcon icon={faEdit} color='var(--blue-500)' />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableTemplate;
