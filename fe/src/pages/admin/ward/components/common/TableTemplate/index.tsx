import React from "react";
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, IconButton } from "@mui/material";
import { faEdit, faEye, faRectangleAd, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";

interface TableTemplateProps {
  data: Array<{ [key: string]: any }>;
  customHeading: string[];
  customColumns: string[];
  isActionColumn: boolean;
  onViewAdsClick?: (idLocation: number) => void;
  onViewDetailsClick?: (idDetails: number) => void;
  onEditClick?: (idEdit: number) => void;
  linkToMove?: string;
}

function TableTemplate({
  data,
  customHeading,
  customColumns,
  isActionColumn,
  onViewAdsClick,
  onViewDetailsClick,
  onEditClick,
  linkToMove
}: TableTemplateProps) {
  const handleViewAdsClick = (rowId: number) => {
    if (onViewAdsClick) {
      onViewAdsClick(rowId);
    }
  };

  const handleViewDetailsClick = (rowId: number) => {
    if (onViewDetailsClick) {
      onViewDetailsClick(rowId);
    }
  };

  const handleEditClick = (rowId: number) => {
    if (onEditClick) {
      onEditClick(rowId);
    }
  };

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
                    column === "objectStatus"
                      ? row[column].value
                        ? `${classes["active"]}`
                        : `${classes["inactive"]} }`
                      : ""
                  }`}
                >
                  {column === "objectStatus" ? row[column].name : row[column]}
                </TableCell>
              ))}

              {/* Action column */}
              {isActionColumn && (
                <TableCell align='center' className={classes["cell-actions"]}>
                  {onViewAdsClick && (
                    <IconButton aria-label='view-ads-list' size='medium' onClick={() => handleViewAdsClick(row.id)}>
                      <FontAwesomeIcon icon={faRectangleAd} color='var(--blue-500)' />
                    </IconButton>
                  )}
                  {onViewDetailsClick && (
                    <IconButton aria-label='view-detail' size='medium' onClick={() => handleViewDetailsClick(row.id)}>
                      <FontAwesomeIcon icon={faEye} color='var(--blue-700)' />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label='edit'
                    size='medium'
                    onClick={() => {
                      handleEditClick(row.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} color='#FFA500' />
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
