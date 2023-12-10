import { memo } from "react";
import Images from "config/images";
import { EmojisId } from "models/custom_question";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
    emojiId?: number;
    className?: string;
}

const Emoji = memo((props: Props) => {
  const { emojiId, className } = props;
  
  const renderImage = (emojiId) => {
    switch (emojiId) {
        case EmojisId.PAIN:
            return Images.imgPain;
        case EmojisId.SAD:
            return Images.imgSad;
        case EmojisId.MEH:
            return Images.imgMeh;
         case EmojisId.SMILE:
            return Images.imgSmile;
        default:
            return Images.imgLaugh;
    }
  }
  return (
     <img src={renderImage(emojiId)} alt="emoji" className={className}/>
  );
});
export default Emoji;