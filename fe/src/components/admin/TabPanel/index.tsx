import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import UserManagementTable from '../UserManagement';
import classes from './styles.module.scss';


export default function TabPanel() {
    const [value, setValue] = React.useState(0);
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
        <Box className={classes.boxContainer}>
            <Box className={classes.boxTabPanel}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Tất cả" />
                    <Tab label="Quận" />
                    <Tab label="Phường" />
                </Tabs>

                <TextField
                    placeholder="Tìm kiếm"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color='primary' />
                            </InputAdornment>
                        ),
                    }}
                    onChange={handleSearchChange}
                    className={classes.customTextField}
                />
            </Box>
            <UserManagementTable role={value} fieldSearch={searchValue} />
        </Box>
        </>
    );
}
