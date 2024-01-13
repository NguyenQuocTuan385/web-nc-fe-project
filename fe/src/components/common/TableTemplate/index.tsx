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
  faEdit,
  faEye,
  faRectangleAd,
  faSquarePlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import ParagraphBody from "../text/ParagraphBody";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { ERole } from "models/general";
interface TableTemplateProps {
  data: Array<{ [key: string]: any }>;
  customHeading: string[];
  customColumns: string[];
  isActionColumn: boolean;
  onViewAdsClick?: (idLocation: number) => void;
  onViewDetailsClick?: (idDetails: number) => void;
  onEditClick?: (idEdit: number) => void;
  onAddClick?: (idAdd: number) => void;
  onDeleteClick?: (idDelete: number) => void;
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
  onAddClick,
  onDeleteClick,
  linkToMove
}: TableTemplateProps) {
  const navigate = useNavigate();
  const currentUser: User = useSelector(selectCurrentUser);
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

  const handleAddClick = (rowId: number) => {
    if (onAddClick) {
      onAddClick(rowId);

      currentUser.role.id === ERole.WARD
        ? navigate(`${routes.admin.contracts.createFormWard.replace(":id", `${rowId}`)}`)
        : navigate(`${routes.admin.contracts.createFormDistrict.replace(":id", `${rowId}`)}`);
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
              <TableCell
                key={index}
                align='left'
                className={`${classes["table-cell"]} ${
                  heading === "STT" ? classes["small-heading"] : ""
                }`}
              >
                {heading}
              </TableCell>
            ))}
            {/* Action column heading */}
            {isActionColumn && (
              <TableCell align='left' className={classes["table-cell"]}>
                Hành động
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {customColumns.map(
                  (column, colIndex) =>
                    column !== "id" && (
                      <TableCell
                        key={colIndex}
                        align='left'
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
                    )
                )}

                {/* Action column */}
                {isActionColumn && (
                  <TableCell align='left' className={classes["cell-actions"]}>
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
                        <FontAwesomeIcon icon={faSquarePlus} color='var(--blue-600)' />
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
          {(!data || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={isActionColumn ? customHeading.length + 1 : customHeading.length}>
                <ParagraphBody className={classes.noList}>Không tìm thấy thông tin</ParagraphBody>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableTemplate;
