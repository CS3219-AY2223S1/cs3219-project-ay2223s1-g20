import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  Toolbar,
  Typography
} from '@mui/material'

function QuestionDrawer () {
  const drawerWidth = '25vw'
  const [questionTitle, setQuestionTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questionDescription, setQuestionDescription] = useState('')
  const [questionExamples, setQuestionExamples] = useState([])

  useEffect(() => {
    setQuestionTitle('Two Sum')
    setDifficulty('Easy')
    setQuestionDescription('Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n' +
    'You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n' +
    'You can return the answer in any order.')

    const examples = []
    examples.push('Input: nums = [3,2,4], target = 6\n' + 'Output: [1,2]')
    examples.push('Input: nums = [3,3], target = 6\n' + 'Output: [0,1]')
    setQuestionExamples(examples)
  }, [])

  const BottomBar = () => {
    return (
        <Box sx={{ position: 'fixed', left: 0, bottom: 0, right: 0 }} bgcolor="white" display={'flex'} justifyContent="center" alignItems="center" m={1} width={'22vw'}>
          <Button variant={'outlined'}>Change Question</Button>
        </Box>
    )
  }

  const QuestionContent = () => {
    return (
      <Box display={'flex'} flexDirection={'column'} px={2} mb={10}>
        <Typography variant={'h2'} class={'poppins'}>{questionTitle}</Typography>
        <Typography variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Poppins', color: 'MediumSeaGreen' }}>{difficulty}</Typography>
        <Divider sx={{ paddingY: 1 }}/>

        <Box py={3}>
            <Typography style={{ whiteSpace: 'pre-line' }} variant={'body'} sx={{ fontSize: '1rem', fontFamily: 'Source Sans Pro' }}>{questionDescription}</Typography>
        </Box>

        {
            questionExamples.map((example, index) => (
                <Box key={index}>
                    <Typography variant={'body'} class={'source'} style={{ fontWeight: 600 }}>Example {index + 1}</Typography>
                    <Box component="span" sx={{ display: 'block', bgcolor: 'WhiteSmoke', borderRadius: '2px' }} p={1} my={0.5}>
                        <Typography style={{ whiteSpace: 'pre-line' }} class={'code'}>{example}</Typography>
                    </Box>
                </Box>
            ))
        }
      </Box>
    )
  }

  return (
    <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
    }}
    >
        <Box flexDirection={'column'}>
            <Toolbar />
            <QuestionContent />
            <BottomBar />
        </Box>

    </Drawer>
  )
}

export default QuestionDrawer
