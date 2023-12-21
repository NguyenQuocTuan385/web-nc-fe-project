import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

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

export default function SearchAppBar() {
  return (
    <Box className={classes["search-wrapper"]}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase placeholder='Search…' inputProps={{ "aria-label": "search" }} />
      </Search>

      <ButtonDownload size='small'>
        Download{" "}
        <IconButton size='medium' aria-label='download'>
          <FontAwesomeIcon width={"15px"} height={"15px"} icon={faArrowDown} color='#fff' />
        </IconButton>
      </ButtonDownload>
    </Box>
  );
}
