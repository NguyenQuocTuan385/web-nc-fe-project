import { Box, Grid, Paper, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { Pack } from "models/pack"
import { Project } from "models/project"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AttachmentService } from "services/attachment"
import { TableCustom } from ".."
import DetailCustomQuestion from "../DetailCustomQuestion"
import classes from './styles.module.scss'
import FileSaver from 'file-saver';
import { getUrlExtension } from "utils/image"
import clsx from "clsx"
import { Lang } from "models/general"
import ProjectHelper from "helpers/project";
import { renderLanguageAttribute } from "../models"

export interface Props {
  project?: Project
}

const DetailSurveySetupForPack = memo(({ project }: Props) => {

  const dispatch = useDispatch()

  const onDownloadPackImage = (pack: Pack) => {
    dispatch(setLoading(true))
    AttachmentService.downloadByUrl(pack.image)
      .then((res) => {
        const ext = getUrlExtension(pack.image)
        FileSaver.saveAs(res.data, `${pack.name}.${ext}`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <Box>
      <Typography variant="h6" component="div" mb={2}>
        Basic information
      </Typography>
      <Grid container spacing={2} ml={0}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" component="div">
            Category: <strong className={clsx({ [classes.danger]: !project?.category })}>{project?.category || "None"}</strong>
          </Typography>
        </Grid>
      </Grid>
      {!!project?.packs?.length && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Packs
          </Typography>
          <Box className={classes.packBox}>
            {project?.packs?.map(item => (
              <Paper key={item.id} className={classes.packItem}>
                <Tooltip title={'Download'}>
                  <img src={item.image} alt="" onClick={() => onDownloadPackImage(item)} />
                </Tooltip>
                <div className={classes.infor}>
                  <div className={classes.inforItem}>Pack Name: <strong>{item.name}</strong></div>
                  <div className={classes.inforItem}>Pack type: <strong>{item.packType?.name}</strong></div>
                  <div className={classes.inforItem}>Brand: <strong>{item.brand}</strong></div>
                  <div className={classes.inforItem}>Variant: <strong>{item.variant}</strong></div>
                  <div className={classes.inforItem}>Manufacturer: <strong>{item.manufacturer}</strong></div>
                </div>
              </Paper>
            ))}
          </Box>
        </>
      )}
      {(!!project?.packs?.length || !!project?.additionalBrands?.length) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Additional brand list
          </Typography>
          <Box ml={2}>
            <TableCustom>
              <TableHead>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>Variant</TableCell>
                  <TableCell>Manufacturer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project?.packs?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.variant}</TableCell>
                    <TableCell>{item.manufacturer}</TableCell>
                  </TableRow>
                ))}
                {project?.additionalBrands?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.variant}</TableCell>
                    <TableCell>{item.manufacturer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableCustom>
          </Box>
        </>
      )}
      {(!!project?.projectAttributes?.length || !!project?.userAttributes?.length) && (
        <>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
            Additional attributes
          </Typography>
          <Box ml={2}>
            <TableCustom>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project?.projectAttributes?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.attribute?.code}</TableCell>
                    <TableCell>
                    {
                      item.attribute?.start ? renderLanguageAttribute(item, "start", Lang.VI) : renderLanguageAttribute(item, "content", Lang.VI)
                    }
                    </TableCell>               
                    <TableCell>{renderLanguageAttribute(item, "end", Lang.VI)}</TableCell>
                    <TableCell>{item.attribute?.type?.name}</TableCell>
                  </TableRow>
                ))}
                {project?.userAttributes?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell></TableCell>
                    <TableCell>{item.start || item.content}</TableCell>
                    <TableCell>{item.end}</TableCell>
                    <TableCell>User attribute</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableCustom>
          </Box>
        </>
      )}
      <DetailCustomQuestion
        project={project}
      />
      {!!project?.eyeTrackingPacks?.length && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Eye-tracking (Competitor pack)
          </Typography>
          <Box className={classes.packBox}>
            {project?.eyeTrackingPacks?.map(item => (
              <Paper key={item.id} className={classes.packItem}>
                <Tooltip title={'Download'}>
                  <img src={item.image} alt="" onClick={() => onDownloadPackImage(item)} />
                </Tooltip>
                <div className={classes.infor}>
                  <div className={classes.inforItem}>Pack Name: <strong>{item.name}</strong></div>
                  <div className={classes.inforItem}>Pack type: <strong>{item.packType?.name}</strong></div>
                  <div className={classes.inforItem}>Brand: <strong>{item.brand}</strong></div>
                  <div className={classes.inforItem}>Variant: <strong>{item.variant}</strong></div>
                  <div className={classes.inforItem}>Manufacturer: <strong>{item.manufacturer}</strong></div>
                </div>
              </Paper>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
})

export default DetailSurveySetupForPack