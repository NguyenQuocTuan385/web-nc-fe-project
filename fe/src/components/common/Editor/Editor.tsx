import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./styles.css";

Quill.register("modules/imageResize", ImageResize);

interface EditorProps {
  placeholder: string;
}

const Editor: React.FC<EditorProps> = ({ placeholder }) => {
  const [editorHtml, setEditorHtml] = useState<string>("");

  const handleChange = (html: string) => {
    setEditorHtml(html);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["clean"]
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent"
  ];

  return (
    <ReactQuill
      theme='snow'
      onChange={handleChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      bounds='#root'
      placeholder={placeholder}
    />
  );
};

export default Editor;
