import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MobileStepper from "@mui/material/MobileStepper";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface SlideShowKImagesProps {
  images: string[];
}

const SlideShowImages: React.FC<SlideShowKImagesProps> = ({ images }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ maxWidth: 500, flexGrow: 1, borderRadius: "8px", overflow: "hidden" }}>
      <AutoPlaySwipeableViews axis='x' index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {images.map((step: string, index: number) => (
          <div key={step + index} style={{ borderRadius: "8px" }}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component='img'
                sx={{
                  height: "200px",
                  display: "block",
                  maxWidth: 500,
                  overflow: "hidden",
                  width: "100%",
                  borderRadius: "8px"
                }}
                src={step}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position='static'
        activeStep={activeStep}
        nextButton={
          <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default SlideShowImages;
