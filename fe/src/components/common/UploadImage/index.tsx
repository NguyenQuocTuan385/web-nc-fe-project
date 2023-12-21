import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ErrorMessage from "../text/ErrorMessage";
import classes from "./styles.module.scss";
import images from "config/images";
import { Box, Card } from "@mui/material";
interface UploadImageProps {
  errorMessage?: string;
  files?: string[] | File[];
  onChange?: (file: string | File) => void;
  maxFiles?: number;
  padding?: string | number;
}

const UploadImage = (props: UploadImageProps) => {
  const { errorMessage, files, onChange, maxFiles, padding } = props;
  const [filesPreview, setFilesPreview] = useState<string[]>([]);

  const handleDrop = useCallback(
    async (acceptedFiles: any) => {
      let files = acceptedFiles;
      onChange && onChange(files);
      const files_temp = acceptedFiles.map((file: File) => {
        return URL.createObjectURL(file);
      });
      setFilesPreview(files_temp);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: maxFiles,
    accept: {
      "image/*": [],
    },
    onDrop: handleDrop,
  });
  return (
    <Box className={classes.uploadImage} padding={padding}>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input className="input-zone" {...getInputProps()} type="file" />
        <div className={classes.dropzoneContent}>
          {isDragActive ? (
            <div>
              <img
                src={images.dropFileIcon}
                alt="upload icon"
                className={classes.uploadImageIcon}
              />
              <p className={classes.dropzoneText}>Thả ở đây</p>
            </div>
          ) : (
            <div>
              <img
                src={images.uploadImageIcon}
                alt="upload icon"
                className={classes.uploadImageIcon}
              />
              <p className={classes.dropzoneText}>
                Kéo ảnh vào đây hoặc nhấn vào đây để chọn ảnh
              </p>
            </div>
          )}
        </div>
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {filesPreview && (
        <Box className={classes.formGroup}>
          <Box display={"flex"} gap={1}>
            {filesPreview.map((item, index) => (
              <Card
                key={index}
                className={classes.imagePreviewCardContainer}
                variant="outlined"
              >
                <img
                  src={item}
                  alt="file upload"
                  className={classes.imagePreview}
                />
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;
