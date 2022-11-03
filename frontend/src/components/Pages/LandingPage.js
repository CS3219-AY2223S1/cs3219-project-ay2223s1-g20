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
            <HeaderBar showUserActions={true}/>
            <Grid container spacing={2}>
                <Grid item xs={6}><DifficultySelection /></Grid>
                <Grid item xs={6}><AttemptedQuestions /></Grid>
            </Grid>

        </Box>
  )
}

export default LandingPage
