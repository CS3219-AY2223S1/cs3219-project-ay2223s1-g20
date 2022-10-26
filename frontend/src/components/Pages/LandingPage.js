import {
  Box,
  Grid
} from '@mui/material'
import HeaderBar from '../common/HeaderBar'
import React from 'react'
import DifficultySelection from '../LandingPageComponents/DifficultySelection'
import AttemptedQuestions from '../LandingPageComponents/AttemptedQuestions'

function LandingPage () {
  return (
        <Box>
            <HeaderBar />
            <Grid container direction="column" sx={{ pt: 10 }}>
                <Grid item><DifficultySelection /></Grid>
                <Grid item><AttemptedQuestions /></Grid>
            </Grid>

        </Box>
  )
}

export default LandingPage
