import { Box, Popover, Typography } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";

interface PopoverHelperProps {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

interface HelperItem {
  imgUrl: string;
  title: string;
}

const PopoverHelper = ({ anchorEl, setAnchorEl }: PopoverHelperProps) => {
  const handleClose = () => {
    setAnchorEl(null);
  };
  const helperItems: HelperItem[] = [
    {
      imgUrl: "https://i.ibb.co/5hWpBFR/icons8-circle-24-3.png",
      title: "Địa điểm đã quy hoạch và không có bảng quảng cáo"
    },
    {
      imgUrl: "https://i.ibb.co/BPbcShD/icons8-circle-24-7.png",
      title: "Địa điểm đã quy hoạch và có bảng quảng cáo"
    },
    {
      imgUrl: "https://i.ibb.co/LvJJcmX/icons8-circle-24-4.png",
      title: "Địa điểm chưa quy hoạch và có bảng quảng cáo"
    },
    {
      imgUrl: "https://i.ibb.co/JyWgyYt/icons8-circle-24-6.png",
      title: "Địa điểm chưa quy hoạch và không có có bảng quảng cáo"
    },
    {
      imgUrl: "https://i.ibb.co/Jmm2yS2/icons8-circle-24-5.png",
      title: "Địa điểm báo cáo"
    }
  ];

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
    >
      <Box className={classes.contentWrapper}>
        <ParagraphBody fontWeight={"bold"}>Thông tin về các địa điểm</ParagraphBody>
        {helperItems.map((item, index) => (
          <Box className={classes.item} key={index}>
            <img src={item.imgUrl} alt='location layer' />
            <ParagraphSmall>{item.title}</ParagraphSmall>
          </Box>
        ))}
      </Box>
    </Popover>
  );
};

export default PopoverHelper;
