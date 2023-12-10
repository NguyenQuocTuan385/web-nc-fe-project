import { memo, useEffect, useMemo, useState } from 'react';
import { Chip, Collapse, Dialog, Grid, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import classes from './styles.module.scss';
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Project } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import ParagraphBody from 'components/common/text/ParagraphBody';
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import { ExpandLess, ExpandMore, UnfoldMore, UnfoldLess } from '@mui/icons-material';
import _ from 'lodash';
import { AttributeContentType } from 'models/user_attribute';
import ArrowBreak from 'components/icons/IconArrowBreak';
import ProjectHelper from 'helpers/project';

interface Props {
  isOpen: boolean,
  project: Project,
  maxSelect: number,
  projectAttributes: ProjectAttribute[],
  onClose: () => void,
  onSubmit: (attributeIds: number[]) => void,
}

const PopupPreDefinedList = memo((props: Props) => {
  const { isOpen, project, maxSelect, projectAttributes, onClose, onSubmit } = props;

  const { t } = useTranslation()

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributesSelected, setAttributesSelected] = useState<number[]>([])
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({});

  const listCategories = useMemo(() => {
    return _.chain(attributes)
      .groupBy(item => item.categoryId)
      .map((value) => ({ category: value?.[0].category, attributes: value }))
      .value()
  }, [attributes])

  const handleCollapse = (categoryId?: number) => {
    const _openCategories = { ...openCategories }
    _openCategories[categoryId ?? 0] = !_openCategories[categoryId ?? 0]
    setOpenCategories(_openCategories)
  };

  const handleExpandAll = () => {
    const _openCategories = {}
    listCategories.forEach(item => _openCategories[item.category?.id ?? 0] = true)
    setOpenCategories(_openCategories)
  };

  const handleCollapseAll = () => {
    const _openCategories = {}
    listCategories.forEach(item => _openCategories[item.category?.id ?? 0] = false)
    setOpenCategories(_openCategories)
  };

  const onChange = (item: Attribute) => {
    if (isDisabled(item)) return
    let _attributesSelected = [...attributesSelected]
    if (_attributesSelected.includes(item.id)) {
      _attributesSelected = _attributesSelected.filter(it => it !== item.id)
    } else {
      _attributesSelected.push(item.id)
    }
    setAttributesSelected(_attributesSelected)
  }

  const getNumberOfAttributesSelected = (data: Attribute[]) => {
    return data?.filter(item => attributesSelected.includes(item.id))?.length || 0
  }

  const _onSubmit = () => {
    if (!attributesSelected?.length) {
      onClose()
      return
    }
    onSubmit(attributesSelected)
  }

  useEffect(() => {
    if (!isOpen) {
      setAttributes([])
      setAttributesSelected([])
    }
  }, [isOpen])

  useEffect(() => {
    if (project?.solutionId && isOpen) {
      AdditionalAttributeService.getAdditionalAttributes({ take: 9999, typeId: AttributeType.PRE_DEFINED, solutionId: project.solutionId })
        .then((res) => {
          const ids = projectAttributes.map(it => it.attributeId)
          const data = (res.data as Attribute[]).filter(it => !ids.includes(it.id))
          setAttributes(data)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, project])

  const isDisabled = (item: Attribute) => {
    return !attributesSelected.includes(item.id) && maxSelect <= attributesSelected.length
  }

  useEffect(() => {
    handleCollapseAll()
  }, [listCategories])

  const prefix_trans = useMemo(() => ProjectHelper.getPrefixTrans(project?.solution?.typeId), [project?.solution?.typeId])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle $backgroundColor="--white">
        <Heading3 $colorName="--gray-90" translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_title`}>{t(`${prefix_trans}_setup_survey_popup_pre_defined_title`)}</Heading3>
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <ParagraphBody $colorName="--eerie-black" translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_sub_title`} 
        dangerouslySetInnerHTML={{
          __html: t(`${prefix_trans}_setup_survey_popup_pre_defined_sub_title`),
        }} />
        <ParagraphSmall $colorName="--gray-80" className={classes.unfoldWrapper}>
          <div className={classes.unfoldItemWrapper} onClick={handleExpandAll} translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_expand_all`}>
            <UnfoldMore sx={{ width: "18px" }} /> {t(`${prefix_trans}_setup_survey_popup_pre_defined_expand_all`)}
          </div>
          <div className={classes.lineDivide}></div>
          <div className={classes.unfoldItemWrapper} onClick={handleCollapseAll} translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_collapse_all`}>
            <UnfoldLess sx={{ width: "18px" }} /> {t(`${prefix_trans}_setup_survey_popup_pre_defined_collapse_all`)}
          </div>
        </ParagraphSmall>

        <Grid container classes={{ root: classes.rootList }}>
          {
            listCategories.length ?
              (
                listCategories.map((item, index) => {
                  return (
                    <div key={index}>
                      <ListItemButton classes={{ root: clsx(classes.rootListItem, { [classes.firstRootListItem]: index === 0 }) }} onClick={() => handleCollapse(item.category?.id)}>
                        <ListItemText classes={{ root: clsx({ [classes.attributeTitle]: !openCategories[item.category?.id ?? 0], [classes.categorySelected]: openCategories[item.category?.id ?? 0] }) }} translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_other_category`} primary={item.category?.name || t(`${prefix_trans}_setup_survey_popup_pre_defined_other_category`)} />
                        {
                          !openCategories[item.category?.id ?? 0] && (
                            <div className={classes.numberOfAttibute}>
                              <Chip
                                sx={{ height: 24, backgroundColor: "var(--cimigo-blue-light-4)", "& .MuiChip-label": { px: 2 } }}
                                label={<ParagraphSmall $colorName="--cimigo-blue-dark-1" $fontWeight="600">{item.attributes.length}</ParagraphSmall>}
                                color="secondary"
                              />
                            </div>
                          )
                        }
                        {
                          getNumberOfAttributesSelected(item.attributes) > 0 &&
                          (
                            <ParagraphSmall $colorName="--cimigo-blue" className={classes.numberOfSelected} translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_number_att_selected`}>{t(`${prefix_trans}_setup_survey_popup_pre_defined_number_att_selected`, { number: getNumberOfAttributesSelected(item.attributes) })}</ParagraphSmall>
                          )
                        }
                        {openCategories[item.category?.id ?? 0] ? <ExpandLess sx={{ color: "var(--gray-90)" }} /> : <ExpandMore sx={{ color: "var(--gray-50)" }} />}
                      </ListItemButton>
                      <Collapse in={openCategories[item.category?.id ?? 0]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.attributes?.map((item) => (
                            <ListItem
                              alignItems="center"
                              component="div"
                              key={item?.id}
                              classes={{ root: clsx(classes.listItem, { [classes.disabled]: isDisabled(item) }) }}
                              disablePadding
                              onClick={() => onChange(item)}
                            >
                              {item?.contentTypeId === AttributeContentType.SINGLE ? (
                                <ListItemText>
                                  <Grid className={classes.listFlex}>
                                    <Grid>
                                      <InputCheckbox
                                        disabled={isDisabled(item)}
                                        checked={attributesSelected.includes(item.id)}
                                        classes={{ root: classes.rootCheckbox }}
                                        checkboxColorType="blue"
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
                                      <InputCheckbox
                                        disabled={isDisabled(item)}
                                        checked={attributesSelected.includes(item.id)}
                                        classes={{ root: classes.rootCheckbox }}
                                        checkboxColorType="blue"
                                      />
                                    </Grid>
                                    <Grid item xs={4} className={classes.listTextLeft}>
                                      <ParagraphBody $colorName="--cimigo-theme-light-on-surface">{item.start}</ParagraphBody>
                                    </Grid>
                                    <Grid item xs={4} className={classes.arrowBreak}>
                                      <ArrowBreak sx={{ color: "var(--gray-20)", width: "40px" }} />
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
                    </div>
                  )
                })
              )
              :
              (
                <Box display="flex" className={classes.emptyItemBox}>
                  <ParagraphBody $colorName="--eerie-black" translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_empty_list_content`}>{t(`${prefix_trans}_setup_survey_popup_pre_defined_empty_list_content`)}</ParagraphBody>
                </Box>
              )
          }
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActionsWrapper}>
        <ParagraphSmall $colorName="--cimigo-blue-dark-2" $fontWeight="500" className={classes.remaining} translation-key={`${prefix_trans}_setup_survey_popup_pre_defined_number_att_remaining`}>{t(`${prefix_trans}_setup_survey_popup_pre_defined_number_att_remaining`, { number: maxSelect - attributesSelected.length })}</ParagraphSmall>
        <Button className={clsx(classes.btn, classes.hideOnMobile)} children={t('common_cancel')} translation-key="common_cancel" btnType={BtnType.Secondary} onClick={onClose} />
        <Button className={clsx(classes.btn, classes.btnAdd)} children={t('common_add')} translation-key="common_add" btnType={BtnType.Raised} onClick={_onSubmit} />
        <Button className={clsx(classes.btn, classes.hideOnDesktop)} children={t('common_cancel')} translation-key="common_cancel" btnType={BtnType.Secondary} onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
});
export default PopupPreDefinedList;
