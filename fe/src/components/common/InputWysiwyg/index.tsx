import { Box } from "@mui/material";
import clsx from "clsx";
import React from "react";
import ReactQuill from "react-quill";
import classes from "./styles.module.scss";
import ErrorMessage from "../text/ErrorMessage";
import TextTitle from "../text/TextTitle";
type InputWysiwygProps = {
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  errorMessage?: string;
};

const InputWysiwyg = (props: InputWysiwygProps) => {
  const { value, onChange, onBlur, errorMessage, title } = props;

  const myColors = ["green", "blue", "gray", "purple", "pink", "yellow", "white", "red", "black"];
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      [{ color: myColors }],
      [{ background: myColors }]
    ]
  };

  return (
    <>
      <Box className={classes.editor}>
        <TextTitle>{title}</TextTitle>
        <ReactQuill
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          modules={modules}
          className={clsx({
            [classes.editorError]: !!errorMessage
          })}
        />
      </Box>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
};

export default InputWysiwyg;
