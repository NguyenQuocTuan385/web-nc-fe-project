import { Slideshow } from "@mui/icons-material";
import { Box } from "@mui/material";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ImagesSliderType {
  original: string;
}

interface ImagesSliderProps {
  images: string[];
}

const ImagesSlider = ({ images }: ImagesSliderProps) => {
  const imageRendered: ImagesSliderType[] = images.map((image) => ({
    original: image
  }));
  return (
    <Box>
      <ImageGallery
        items={imageRendered}
        showBullets={true}
        showIndex={true}
        showThumbnails={true}
        showNav={true}
        showFullscreenButton={true}
      />
    </Box>
  );
};

export default ImagesSlider;
