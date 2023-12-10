import { createStyles, makeStyles } from "@mui/styles";

export default makeStyles(() =>
  createStyles({
    root: {

    },
    paper: {
      border: "solid 1px rgba(145, 158, 171, 0.08)",
      overflow: "inherit",
      boxShadow: "0 0 2px 0 rgb(145 158 171 / 24%), 0 20px 40px -4px rgb(145 158 171 / 24%)",
      marginTop: 12,
      marginLeft: 4,
    },
    arrow: {
      display: "none",
      "@media(min-width:767px)": {
        top: -8,
        right: 20,
        width: 0,
        height: 0,
        content: "",
        zIndex: 1,
        position: "absolute",
        borderBottom: "8px solid #F0F0F0",
        borderRight: "solid 6px transparent",
        borderLeft: "solid 6px transparent",
      },
    }
  })
);

// // export default useStyles;
