import { Box, Paper, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import Emoji from "components/common/images/Emojis"
import { CustomQuestion, ECustomQuestionType } from "models/custom_question"
import { Project } from "models/project"
import { memo } from "react"
import { TableCustom, ExclusiveBox } from ".."


export interface Props {
  project?: Project
}

const DetailCustomQuestion = memo(({ project }: Props) => {

  const getContentCustomQuestion = (item: CustomQuestion) => {
    switch (item.typeId) {
      case ECustomQuestionType.Open_Question:
        return null;
      case ECustomQuestionType.Single_Choice:
      case ECustomQuestionType.Multiple_Choices:
        return (
          <>
            {!!item.answers?.length && (
              <>
                <Typography variant="subtitle1" component="div">
                  Answers:
                </Typography>
                {item.answers.map((answer) => (
                  <Typography key={answer.id} display="flex" alignItems="center" marginLeft={4} variant="subtitle1" component="div">
                    Title: {" "}
                    {answer.title}
                    {answer.exclusive && <ExclusiveBox>exclusive</ExclusiveBox>}
                  </Typography>
                ))}
              </>
            )}
          </>
        );
      case ECustomQuestionType.Numeric_Scale:
        return (
          <>
            <Box display="flex">
              <Typography variant="subtitle1" component="div">
                From: <span style={{ fontWeight: 500 }}>{item.scaleRangeFrom}</span>
              </Typography>
              <Typography ml={3} variant="subtitle1" component="div">
                To: <span style={{ fontWeight: 500 }}>{item.scaleRangeTo}</span>
              </Typography>
            </Box>
            {!!item.customQuestionAttributes?.length && (
              <>
                <Typography variant="subtitle1" component="div">
                  Multiple attributes:
                </Typography>
                <Box ml={2} mt={1}>
                  <TableCustom>
                    <TableHead>
                      <TableRow>
                        <TableCell>Left label</TableCell>
                        <TableCell>Right label</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.customQuestionAttributes?.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.leftLabel}</TableCell>
                          <TableCell>{item.rightLabel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableCustom>
                </Box>
              </>
            )}
          </>
        )
      case ECustomQuestionType.Smiley_Rating:
        return (
          <>
            <Typography variant="subtitle1" component="div">
              Smiley scale: <span style={{ fontWeight: 500 }}>{item.customQuestionEmojis?.length || 0} faces</span>
            </Typography>
            <Box display="flex" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">
              {item.customQuestionEmojis?.map(customQuestionEmoji => (
                <Box key={customQuestionEmoji.id} flex={1} ml={2} mt={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minWidth="150px">
                  <Emoji emojiId={customQuestionEmoji.emojiId} />
                  <Typography variant="subtitle1" align="center" mt={0.5}>
                    {customQuestionEmoji.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            {!!item.customQuestionAttributes?.length && (
              <>
                <Typography variant="subtitle1" component="div">
                  Multiple attributes:
                </Typography>
                <Box ml={2} mt={1}>
                  <TableCustom>
                    <TableHead>
                      <TableRow>
                        <TableCell>Attribute</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.customQuestionAttributes?.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.attribute}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableCustom>
                </Box>
              </>
            )}
          </>
        )
      case ECustomQuestionType.Star_Rating:
        return (
          <>
            <Typography variant="subtitle1" component="div">
              Number of stars: <span style={{ fontWeight: 500 }}>{item.numberOfStars || 0}</span>
            </Typography>
            {!!item.customQuestionAttributes?.length && (
              <>
                <Typography variant="subtitle1" component="div">
                  Multiple attributes:
                </Typography>
                <Box ml={2} mt={1}>
                  <TableCustom>
                    <TableHead>
                      <TableRow>
                        <TableCell>Attribute</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.customQuestionAttributes?.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.attribute}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableCustom>
                </Box>
              </>
            )}
          </>
        )
    }
  }

  return (
    !!project?.customQuestions?.length && (
      <>
        <Typography variant="h6" component="div" sx={{ marginBottom: 2, marginTop: 4 }}>
          Custom questions
        </Typography>
        <Box ml={2}>
          {project.customQuestions.map((question) => (
            <Paper sx={{ mt: 2, p: 2 }} key={question.id}>
              <Typography variant="subtitle1" component="div">
                Question title: <span style={{ fontWeight: 500 }}>{question.title}</span>
              </Typography>
              <Box marginLeft={4}>
                <Typography variant="subtitle1" component="div">
                  Type: <span style={{ fontWeight: 500 }}>{question.type.title}</span>
                </Typography>
                {getContentCustomQuestion(question)}
              </Box>
            </Paper>
          ))}
        </Box>
      </>
    )
  )
})

export default DetailCustomQuestion