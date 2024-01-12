import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton
} from "@mui/material";
import {
  faBuildingCircleArrowRight,
  faEdit,
  faEye,
  faRectangleAd,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";
interface TableTemplateProps {
  data: Array<{ [key: string]: any }>;
  customHeading: string[];
  customColumns: string[];
  isActionColumn: boolean;
  onViewAdsClick?: (idLocation: number) => void;
  onViewDetailsClick?: (idDetails: number) => void;
  onViewWardInDistrictClick?: (idDistrict: number) => void;
  onEditClick?: (idEdit: number) => void;
  onAddClick?: (idAdd: number) => void;
  onDeleteClick?: (idDelete: number) => void;
  linkToMove?: string;
}

function TableTemplateDCMS({
  data,
  customHeading,
  customColumns,
  isActionColumn,
  onViewAdsClick,
  onViewDetailsClick,
  onViewWardInDistrictClick,
  onEditClick,
  onAddClick,
  onDeleteClick,
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

  const handleViewWardInDistrictClick = (rowId: number) => {
    if (onViewWardInDistrictClick) {
      onViewWardInDistrictClick(rowId);
    }
  };

  const handleEditClick = (rowId: number) => {
    if (onEditClick) {
      onEditClick(rowId);
    }
  };

  const handleAddClick = (rowId: number) => {
    if (onAddClick) {
      onAddClick(rowId);
      console.log("Add here!");
    }
  };
  const handleDeleteClick = (rowId: number) => {
    if (onDeleteClick) {
      onDeleteClick(rowId);
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
                  {onViewWardInDistrictClick && (
                    <IconButton
                      aria-label='view-ward'
                      size='medium'
                      onClick={() => handleViewWardInDistrictClick(row.id)}
                    >
                      <FontAwesomeIcon icon={faBuildingCircleArrowRight} color='var(--blue-700)' />
                    </IconButton>
                  )}
                  {onViewAdsClick && (
                    <IconButton
                      aria-label='view-ads-list'
                      size='medium'
                      onClick={() => handleViewAdsClick(row.id)}
                    >
                      <FontAwesomeIcon icon={faRectangleAd} color='var(--blue-500)' />
                    </IconButton>
                  )}
                  {onViewDetailsClick && (
                    <IconButton
                      aria-label='view-detail'
                      size='medium'
                      onClick={() => handleViewDetailsClick(row.id)}
                    >
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
                  {onAddClick && row.statusContract !== 1 && (
                    <IconButton
                      aria-label='add'
                      size='medium'
                      onClick={() => handleAddClick(row.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} color='var(--red-error)' />
                    </IconButton>
                  )}
                  {onDeleteClick && (
                    <IconButton size='medium' onClick={() => handleDeleteClick(row.id)}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: "var(--red-error)" }} />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableTemplateDCMS;
