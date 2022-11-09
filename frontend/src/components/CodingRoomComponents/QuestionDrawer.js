import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  Toolbar,
  Typography
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'
import { grey, blue } from '@mui/material/colors'
import ChangeQuestionDialog from '../Dialogs/ChangeQuestionDialog'
import { getCollabSocket } from '../../api/socketApi'
import { getQuestionFromQuestionNum } from '../../api/questionApi'
import { postQuestionIdByUsername } from '../../api/historyApi'
import { getUsername } from '../../api/cookieApi'

function QuestionDrawer (props) {
  const drawerWidth = '25vw'
  const [questionTitle, setQuestionTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questionDescription, setQuestionDescription] = useState('')
  const [questionExamples, setQuestionExamples] = useState([])
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false)
  const [questionDialogType, setQuestionDialogType] = useState('request')

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    let isEmpty = Object.keys(props.questionData).length == 0
    if (props.questionData && !isEmpty) {
      updateQuestionStates(props.questionData)
      setShowContent(true)
    }
  }, [])

  useEffect(() => {
    const collabSocket = getCollabSocket()
    collabSocket.on('changeQuestionReq', () => openDialog('receive'))
    collabSocket.on('newQuestion', handleNewQuestion)
  }, [])

  const openDialog = (type) => {
    setQuestionDialogType(type)
    setOpenQuestionDialog(true)
  }

  const updateQuestionStates = (data) => {
    setQuestionTitle(data.questionTitle)
    setDifficulty(data.difficulty)
    setQuestionDescription(data.questionDescription)

    const examples = data.examples

    if (examples.constructor.name !== 'Array') {
      const split = examples.split('\n').filter(e => e !== '')
      let parsedExamples = []
      let curr = ''
      for (let i = 0; i < split.length; i++) {
        if (split[i].includes('Example')) {
          parsedExamples.push(curr)
        } else {
          const newline = split[i].includes('Output') ? '\n\n' : '\n'
          curr += split[i] + newline
        }
      }
      parsedExamples = parsedExamples.filter(e => e !== '')
      setQuestionExamples(parsedExamples)
    } else {
      setQuestionExamples(examples)
    }
  }

  const handleNewQuestion = useCallback(({ data }) => {
    const qnNum = data
    const response = getQuestionFromQuestionNum(qnNum)
    response
      .then(res => res.json())
      .then(res => {
        updateQuestionStates(res)
        setOpenQuestionDialog(false)
      })
    postQuestionIdByUsername(getUsername(), qnNum)
  }, [])

  const buttonTheme = createTheme({
    palette: {
      primary: {
        main: grey[50],
        contrastText: blue[500]
      }
    }
  })

  const BottomBar = () => {
    return (
      <ThemeProvider theme={buttonTheme}>
        <Box sx={{ position: 'fixed', left: 0, bottom: 0, right: 0 }} bgcolor="transparent" display={'flex'} justifyContent="center" alignItems="center" m={1} width={'22vw'}>
          <Button variant={'contained'} onClick={() => openDialog('request')}>Change Question</Button>
        </Box>
      </ThemeProvider>
    )
  }

  const QuestionContent = () => {
    return (
      <Box display={'flex'} flexDirection={'column'} px={2} mb={10}>
        <Typography variant={'h2'} class={'poppins'}>{questionTitle}</Typography>
        <Typography variant={'body'}
          sx={{ fontSize: '1rem', fontFamily: 'Poppins', color: difficulty === 'Medium' ? 'Orange' : (difficulty === 'Hard') ? 'Red' : 'MediumSeaGreen' }}>
          {difficulty}
        </Typography>
        <Divider sx={{ paddingY: 1 }}/>

        <Box py={3}>
            <Typography style={{ whiteSpace: 'pre-line' }} variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>
              {questionDescription.split('\\n\\n').map((i, key) => {
                return <div key={key}>{i}{'\n\n'}</div>
              })}
            </Typography>
        </Box>

        {
          questionExamples.map((example, index) => (
              <Box key={index}>
                  <Typography variant={'body'} class={'source'} style={{ fontWeight: 600 }}>Example {index + 1}</Typography>
                  <Box component="span" sx={{ display: 'block', bgcolor: 'WhiteSmoke', borderRadius: '2px' }} p={1} my={0.5}>
                      <Typography style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }} class={'code'}>
                        {example.split('\\n').map((i, key) => {
                          return <div key={key}>{i}{'\n'}</div>
                        })}
                      </Typography>
                  </Box>
              </Box>
          ))
        }
      </Box>
    )
  }

  return showContent && (
    <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
    }}
    >
        <Box flexDirection={'column'}>
            { openQuestionDialog && <ChangeQuestionDialog open={openQuestionDialog} setOpen={setOpenQuestionDialog} type={questionDialogType}/>}
            <Toolbar />
            <QuestionContent />
            <BottomBar />
        </Box>

    </Drawer>
  )
}

export default QuestionDrawer
