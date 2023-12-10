import { memo, useEffect, useMemo, useState } from 'react';
import { Checkbox, Collapse, Dialog, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import classes from './styles.module.scss';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { Project } from 'models/project';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import ParagraphBody from 'components/common/text/ParagraphBody';
import clsx from 'clsx';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Heading5 from 'components/common/text/Heading5';
import { AttributeContentType } from 'models/user_attribute';
import ArrowBreak from 'components/icons/IconArrowBreak';
import ProjectHelper from 'helpers/project';
interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}


const PopupManatoryAttributes = memo((props: Props) => {
  const { isOpen, project, onClose } = props;
  const { t } = useTranslation()

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [isExpand, setIsExpand] = useState(false)

  useEffect(() => {
    if (project?.solutionId) {
      AdditionalAttributeService.getAdditionalAttributes({ take: 9999, typeId: AttributeType.MANATORY, solutionId: project.solutionId })
        .then((res) => {
          setAttributes(res.data)
        })
    }
  }, [project?.solutionId])
  
  const prefix_trans = useMemo(() => ProjectHelper.getPrefixTrans(project?.solution?.typeId), [project?.solution?.typeId])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle $backgroundColor="--white">
        <Heading3 $colorName="--gray-90" translation-key={`${prefix_trans}_setup_survey_popup_m_att_title`}>{t(`${prefix_trans}_setup_survey_popup_m_att_title`)}</Heading3>
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
      <ParagraphBody $colorName="--eerie-black" translation-key={`${prefix_trans}_setup_survey_popup_m_att_sub_title`}>{t(`${prefix_trans}_setup_survey_popup_m_att_sub_title`)}</ParagraphBody>
        <Grid container sx={{paddingTop:"24px"}} classes={{ root: classes.rootList }}>
          <ListItemButton classes={{ root: clsx(classes.rootListItem) }} onClick={()=>{setIsExpand(!isExpand)}}>
            <Heading5 $fontWeight={400} className={clsx(classes.listItemTitle, {[classes.selected]: isExpand})} translation-key={`${prefix_trans}_setup_survey_popup_m_att_title`}>{t(`${prefix_trans}_setup_survey_popup_m_att_title`)}</Heading5>
            {isExpand ? <ExpandLess sx={{color: "var(--gray-90)"}} /> : <ExpandMore sx={{color: "var(--gray-50)"}} />}
          </ListItemButton>
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {attributes?.map((item) => (
                <ListItem
                  alignItems="center"
                  component="div"
                  key={item?.id}
                  classes={{ root: classes.listItem }}
                  disablePadding
                >
                  {item?.contentTypeId === AttributeContentType.SINGLE ? (
                    <ListItemText>
                      <Grid className={classes.listFlex}>
                        <Grid>
                          <Checkbox
                            disabled={true}
                            checked={true}
                            classes={{ root: classes.rootCheckbox }}
                            />
                        </Grid>
                        <Grid item>
                          <ParagraphBody $colorName="--cimigo-theme-light-on-surface">{item.content}</ParagraphBody>
                        </Grid>
                      </Grid>
                    </ListItemText>
                  ) : (
                    <ListItemText>
                      <Grid className={classes.listFlex}>
                        <Grid>
                          <Checkbox
                            disabled={true}
                            checked={true}
                            classes={{ root: classes.rootCheckbox }}
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.listTextLeft}>
                          <ParagraphBody $colorName="--cimigo-theme-light-on-surface">{item.start}</ParagraphBody>
                        </Grid>
                        <Grid item xs={4} className={classes.arrowBreak}>
                          <ArrowBreak sx={{color: "var(--gray-20)", width: "40px"}}/>
                        </Grid>
                        <Grid item xs={4} className={classes.listTextRight}>
                          <ParagraphBody $colorName="--cimigo-theme-light-on-surface">{item.end}</ParagraphBody>
                        </Grid>
                      </Grid>
                    </ListItemText>
                  )}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});
export default PopupManatoryAttributes;



