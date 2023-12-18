import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';

interface FoodProps {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

const createData = ({ name, calories, fat, carbs, protein }: FoodProps) => {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData({ name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 }),
  createData({ name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 }),
  createData({ name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 }),
  createData({ name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 }),
  createData({ name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 }),
];

const itemsPerPage = 3; // Số dòng mỗi trang

export default function UserManagement() {
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(startIndex, endIndex).map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(rows.length / itemsPerPage)}
        page={currentPage}
        onChange={handleChangePage}
      />
    </div>
  );
}
