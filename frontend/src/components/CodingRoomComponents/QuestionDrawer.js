import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  Toolbar,
  Typography
} from '@mui/material'
import ChangeQuestionDialog from '../Dialogs/ChangeQuestionDialog'
import { getCollabSocket } from '../../api/socketApi'
import { getQuestionFromQuestionNum } from '../../api/questionApi'

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
    console.log(props.questionData)
    if (props.questionData) {
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
    setQuestionExamples(data.examples)
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
  }, [])

  const BottomBar = () => {
    return (
        <Box sx={{ position: 'fixed', left: 0, bottom: 0, right: 0 }} bgcolor="white" display={'flex'} justifyContent="center" alignItems="center" m={1} width={'22vw'}>
          <Button variant={'outlined'} onClick={() => openDialog('request')}>Change Question</Button>
        </Box>
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
                      <Typography style={{ whiteSpace: 'pre-line' }} class={'code'}>
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
