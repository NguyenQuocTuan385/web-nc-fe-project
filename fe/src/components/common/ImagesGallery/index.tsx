import LightGallery from "lightgallery/react";
import { memo } from "react";
import classes from "./styles.module.scss";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";

interface ImagesGalleryProps {
  images: string[];
}

const ImagesGallery = memo(({ images }: ImagesGalleryProps) => {
  return (
    <LightGallery
      elementClassNames={classes.imagesContainer}
      speed={500}
      plugins={[lgThumbnail, lgZoom]}
      download={false}
    >
      {images.map((image, index) => (
        <a className={classes.imageWrapper} key={index} href={image}>
          <img src={image} alt="Location images" />
        </a>
      ))}
    </LightGallery>
  );
});

export default ImagesGallery;
