import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BasicPagination from '@mui/material/Pagination';
import { Box, IconButton } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import classes from './styles.module.scss';

function createData(
    id: number,
    name: string,
    email: string,
    role: string,
    location: string
) {
    return { id, name, email, role, location };
}

const rows = [
    createData(1, 'Dương Chí Thông', 'dct@gmail.com', 'Quận', 'Quận 1'),
    createData(2, 'Nguyễn Thị Hương', 'nth@gmail.com', 'Phường', 'Phường Bến Thành, Quận 1'),
    createData(3, 'Trần Văn Tuấn', 'tvt@gmail.com', 'Quận', 'Quận 7'),
    createData(4, 'Lê Thị Thu Hà', 'lth@gmail.com', 'Phường', 'Phường Tân Định, Quận 1'),
    createData(5, 'Phạm Minh Tuấn', 'pmt@gmail.com', 'Quận', 'Quận Bình Thạnh'),
    createData(6, 'Nguyễn Thanh Mai', 'ntm@gmail.com', 'Phường', 'Phường 15, Quận 11'),
    createData(7, 'Lê Văn Hoàng', 'lvh@gmail.com', 'Quận', 'Quận Tân Bình'),
    createData(8, 'Trần Thị Thu Hằng', 'tth@gmail.com', 'Phường', 'Phường Phạm Ngũ Lão, Quận 1'),
    createData(9, 'Phan Văn Long', 'pvl@gmail.com', 'Quận', 'Quận 3'),
    createData(10, 'Nguyễn Thị Ngọc Anh', 'ntna@gmail.com', 'Phường', 'Phường Bình Thạnh, Quận 2'),
    createData(11, 'Trần Văn Hòa', 'tvh@gmail.com', 'Quận', 'Quận 5'),
    createData(12, 'Lê Thị Lan Anh', 'ltla@gmail.com', 'Phường', 'Phường 10, Quận 10'),
    createData(13, 'Võ Văn Khánh', 'vvk@gmail.com', 'Quận', 'Quận 4'),
    createData(14, 'Nguyễn Thị Minh Thúy', 'ntmt@gmail.com', 'Phường', 'Phường Thảo Điền, Quận 2'),
    createData(15, 'Lê Văn Tiến', 'lvt@gmail.com', 'Quận', 'Quận 10'),
    createData(16, 'Phạm Thị Thu Trang', 'pttt@gmail.com', 'Phường', 'Phường 7, Quận 3'),
    createData(17, 'Nguyễn Văn Dũng', 'nvd@gmail.com', 'Quận', 'Quận 6'),
    createData(18, 'Trần Thị Hồng Hạnh', 'tthh@gmail.com', 'Phường', 'Phường 2, Quận 4'),
    createData(19, 'Đỗ Văn Quang', 'dvq@gmail.com', 'Quận', 'Quận 2'),
    createData(20, 'Phan Thị Hồng Loan', 'pthl@gmail.com', 'Phường', 'Phường 12, Quận 5')];

const rowsPerPage = 10;
interface FilterProps{
    role: number,
    fieldSearch: string,
}
export default function UserManagementTable({role, fieldSearch}: FilterProps){
    const [page, setPage] = useState(1);
    console.log(role);
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const [filterRole, setFilterRole] = useState(rows);
    useEffect(() => {
        if (role === 1) {
          setFilterRole(rows.filter((row) => row.role === 'Quận'));
        } else if (role === 2) {
          setFilterRole(rows.filter((row) => row.role === 'Phường'));
        } else {
          setFilterRole(rows);
        }
      }, [role]);

        useEffect(() => {
            if (fieldSearch !== '') {
            setFilterRole(rows.filter((row) => row.name.toLowerCase().includes(fieldSearch.toLowerCase())));
            } else {
            setFilterRole(rows);
            }
        }, [fieldSearch]);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filterRole.length - (page - 1) * rowsPerPage);

    return (
        <Box 
        display={'flex'} 
        flexDirection={'column'}>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.sizeTable} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '5%'}}>ID</TableCell>
                            <TableCell align="left" className={classes.headerTable} >Họ và tên</TableCell>
                            <TableCell align="left" className={classes.headerTable}>Email</TableCell>
                            <TableCell align="left" className={classes.headerTable}>Cán bộ</TableCell>
                            <TableCell align="left" className={classes.headerTable}>Khu vực quản lý</TableCell>
                            <TableCell align="center" className={classes.headerTable}>Tác vụ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterRole.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage).map(
                            (row) => (
                                <TableRow
                                    key={row.id}
                                    className={classes.rowTable}
                                >
                                    <TableCell component="th" scope="row" >
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="left" className={classes.dataTable}>{row.name}</TableCell>
                                    <TableCell align="left" className={classes.dataTable}>{row.email}</TableCell>
                                    <TableCell align="left" className={classes.dataTable}>{row.role}</TableCell>
                                    <TableCell align="left" className={classes.dataTable}>{row.location}</TableCell>
                                    <TableCell align="center" className={classes.dataTable}>
                                        <IconButton aria-label="edit" size="medium">
                                       <FontAwesomeIcon icon={faEdit} color='var(--blue-500)'/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={5} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <BasicPagination
            color='primary'
                count={Math.ceil(filterRole.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                className={classes.pagination}
            />
        </Box>
    );
}
