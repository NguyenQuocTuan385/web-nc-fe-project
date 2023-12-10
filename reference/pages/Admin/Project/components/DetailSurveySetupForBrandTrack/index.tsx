import { Box, Grid, Paper, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { BrandAsset } from "models/brand_asset"
import { Project } from "models/project"
import { memo, useMemo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AttachmentService } from "services/attachment"
import { TableCustom } from ".."
import DetailCustomQuestion from "../DetailCustomQuestion"
import classes from './styles.module.scss'
import FileSaver from 'file-saver';
import { getUrlExtension } from "utils/image"
import clsx from "clsx"
import { EBrandType } from "models/additional_brand";
import { brandAssetTypes, EBRAND_ASSET_TYPE } from "models/brand_asset";
import { Lang } from "models/general"
import { renderLanguageAttribute } from "../models"
export interface Props {
  project?: Project
}

const DetailSurveySetupForBrandTrack = memo(({ project }: Props) => {

  const dispatch = useDispatch()

  const mainBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project])
  const competingBrands = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project])
  const competitiveBrands = useMemo(() => project?.projectBrands || [], [project])
  const onDownload = (brandAsset: BrandAsset) => {
    dispatch(setLoading(true))
    AttachmentService.downloadByUrl(brandAsset.asset)
      .then((res) => {
        const ext = getUrlExtension(brandAsset.asset)
        FileSaver.saveAs(res.data, `${brandAsset.brand}.${ext}`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const getAssetTypeName = (typeId: number) => {
    return brandAssetTypes.find((item) => item.id === typeId)?.name
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
          <Typography variant="subtitle1" component="div">
            Premise: <strong className={clsx({ [classes.danger]: !project?.onPremise, [classes.green]: project?.onPremise })}>{project.onPremise ? "On" : "Off"}</strong>
          </Typography>
        </Grid>
      </Grid>
      {(!!mainBrands?.length) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Main brands list
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
                {mainBrands.map(item => (
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
      {(!!competingBrands?.length) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Competing brands list
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
                {competingBrands.map(item => (
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
      {(!!competitiveBrands?.length) && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Competitive brands list
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
                {competitiveBrands.map(item => (
                  <TableRow key={item.brand.id}>
                    <TableCell>{item.brand.brand}</TableCell>
                    <TableCell>{item.brand.variant}</TableCell>
                    <TableCell>{item.brand.manufacturer}</TableCell>
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
            Brand equity attributes
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
      {(!!project?.brandAssets?.length) && (
        <>
          <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
            Brand assets
          </Typography>
          <Box className={classes.packBox}>
            {project?.brandAssets?.map(item => (
              <Paper key={item.id} className={classes.packItem}>
                <div className={classes.infor}>
                  <div className={classes.inforItem}>Brand Name: <strong>{item.brand}</strong></div>
                  {
                    item.description && (<div className={classes.inforItem}>Description: <strong>{item.description}</strong></div>)
                  }
                  <div className={classes.inforItem}>Type: <strong>{getAssetTypeName(item.typeId)} </strong>
                    {item.typeId === EBRAND_ASSET_TYPE.SOUND && <span className={classes.downloadWording} onClick={() => onDownload(item)}>(download)</span>}
                  </div>
                  {
                      item.typeId === EBRAND_ASSET_TYPE.SLOGAN && (
                        <div className={classes.inforItem}>Slogan: <strong>{item.slogan}</strong></div>
                      )
                    }
                  <Box mt={2}>
                    {
                      item.typeId === EBRAND_ASSET_TYPE.IMAGE && (
                        <Tooltip title={'Download'}>
                          <img src={item.asset} alt="" onClick={() => onDownload(item)} />
                        </Tooltip>
                      )
                    }
                    {
                      item.typeId === EBRAND_ASSET_TYPE.SOUND && (
                        <audio controls>
                          <source src={item.asset} />
                        </audio>
                      )
                    }
                  </Box>
                </div>
              </Paper>
            ))}
          </Box>
        </>
      )}
      <DetailCustomQuestion
        project={project}
      />
    </Box>
  )
})

export default DetailSurveySetupForBrandTrack