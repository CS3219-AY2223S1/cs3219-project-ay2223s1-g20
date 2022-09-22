import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material'
import HeaderBar from '../common/HeaderBar'
import MatchingDialog from '../Dialogs/MatchingDialog'
import React, { useState } from 'react'

function LandingPage () {
  const [showMatchingDialog, setShowMatchingDialog] = useState(false)
  const [level, setLevel] = useState('')

  const handleCardSelect = (difficulty) => {
    setLevel(difficulty)
    setShowMatchingDialog(true)
  }

  const DifficultyCard = (level) => {
    const imgUrl = './static/' + level + '.png'
    return (
            <Card variant="outlined">
                <CardActionArea sx={{ p: 3 }} onClick={e => handleCardSelect(level)}>
                    <CardMedia
                        component="img"
                        image={imgUrl}
                        height='100%'
                        width='100%'
                        alt="Difficulty Badge"
                    />
                    <CardContent>
                        <Box display={'flex'} justifyContent="center" alignItems="center">
                            <Typography variant={'h4'}> {level} </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
    )
  }

  function difficultySelection () {
    return (
            <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" minHeight="100vh">
                <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" width="80vw">
                    <Typography variant={'h1'} class={'poppins'}>Get Matched!</Typography>
                    <Typography variant={'h2'} class={'source'} marginBottom={'3rem'}>Choose a difficulty</Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={4} md={2}>{DifficultyCard('Easy')}</Grid>
                        <Grid item xs={6} sm={4} md={2}>{DifficultyCard('Medium')}</Grid>
                        <Grid item xs={6} sm={4} md={2}>{DifficultyCard('Hard')}</Grid>
                    </Grid>
                </Box>
            </Box>
    )
  }

  return (
        <Box>
            <HeaderBar />
            {difficultySelection()}
            {showMatchingDialog &&
                <MatchingDialog
                    open={showMatchingDialog}
                    setOpen={setShowMatchingDialog}
                    difficulty={level}
                />
            }
        </Box>

  )
}

export default LandingPage
