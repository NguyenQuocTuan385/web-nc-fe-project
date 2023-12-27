import * as React from "react";
import { styled, alpha, Box, Button, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

import classes from "./styles.module.scss";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto"
  }
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch"
      }
    }
  },
  border: "1px solid var(--blue-500)",
  borderRadius: "8px"
}));

const ButtonDownload = styled(Button)(() => ({
  backgroundColor: "var(--blue-500)",
  color: "#fff",
  padding: "0 10px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "var(--blue-600)",
    color: "var(--blue-100)"
  }
}));

export default function SearchAppBar({ onSearch }: any) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Box className={classes["search-wrapper"]}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase placeholder='Search…' inputProps={{ "aria-label": "search" }} onChange={handleSearchChange} />
      </Search>

      <ButtonDownload size='small' sx={{ height: "39px", padding: "0 12px" }}>
        <FontAwesomeIcon width={"20px"} height={"20px"} icon={faSquarePlus} color='#fff' />{" "}
        <span style={{ marginLeft: "2px" }}>Thêm</span>
      </ButtonDownload>
    </Box>
  );
}
