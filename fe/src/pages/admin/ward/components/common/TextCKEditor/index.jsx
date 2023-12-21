import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import {Editor as ClassicEditor} from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Box } from "@mui/material";

export const TextCKEditor = () => {
  return (
    <Box>
      <div className='text-ck-editor'>
        <CKEditor
          editor={ClassicEditor}
          data='<p>Hello from CKEditor 5!</p>'
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    </Box>
  );
};
