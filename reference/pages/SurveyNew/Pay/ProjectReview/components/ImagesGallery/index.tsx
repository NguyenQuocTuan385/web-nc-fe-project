import LightGallery from "lightgallery/react";
import { memo } from "react";
import classes from "./styles.module.scss";
import { PriceTestPicture } from "models/price_test";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";

interface ImagesGalleryProps {
  imagesUrl: PriceTestPicture[];
}

const ImagesGallery = memo(({ imagesUrl }: ImagesGalleryProps) => {
  return (
    <LightGallery
      elementClassNames={classes.imagesContainer}
      speed={500}
      plugins={[lgThumbnail, lgZoom]}
      download={false}
    >
      {imagesUrl.map((image, index) => (
        <a className={classes.imageWrapper} key={index} href={image.url}>
          <img src={image.url} alt="Price Test Img" />
        </a>
      ))}
    </LightGallery>
  );
});

export default ImagesGallery;
