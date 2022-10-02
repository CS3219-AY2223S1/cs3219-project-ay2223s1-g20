import {
  Box,
  Typography
} from '@mui/material'
import React from 'react'

function AttemptedQuestions () {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" minHeight="100vh">
        <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" width="40vw">
            <Typography variant={'h1'} class={'poppins'}>Attempted Questions</Typography>
        </Box>
    </Box>
  )
}

export default AttemptedQuestions
