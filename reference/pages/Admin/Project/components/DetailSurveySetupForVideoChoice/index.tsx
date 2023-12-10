import { Box, Grid, Typography } from "@mui/material";
import clsx from "clsx";
import { Project } from "models/project";
import { memo } from "react";
import DetailCustomQuestion from "../DetailCustomQuestion";
import VideoDetailItem from "../VideoDetailItem";
import classes from './styles.module.scss'

export interface Props {
  project?: Project;
}

const DetailSurveySetupForPack = memo(({ project }: Props) => {
  return (
    <Box>
      <Typography variant="h6" component="div" mb={2}>
        Basic information
      </Typography>
      <Grid container spacing={2} ml={0}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" component="div">
            Category:{" "}
            <strong className={clsx({ [classes.danger]: !project?.category })}>
              {project?.category || "None"}
            </strong>
          </Typography>
        </Grid>
      </Grid>
      {!!project?.videos?.length && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Videos
          </Typography>
          <Grid ml={2}>
            <Grid spacing={2} container>
              {project?.videos?.map((item, index) => (
                <VideoDetailItem key={index} item={item} />
              ))}
            </Grid>
          </Grid>
        </>
      )}
      <DetailCustomQuestion project={project} />
    </Box>
  );
});

export default DetailSurveySetupForPack;
