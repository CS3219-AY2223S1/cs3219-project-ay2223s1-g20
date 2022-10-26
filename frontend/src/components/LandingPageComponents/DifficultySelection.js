import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import MatchingDialog from '../Dialogs/MatchingDialog'

function DifficultySelection () {
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

  const DifficultyCards = () => {
    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent="flex-start" alignItems="center" minHeight="50vh" width="100vw">
            <Typography variant={'h1'} class={'poppins'}>Get Matched!</Typography>
            <Typography variant={'h2'} class={'source'} marginBottom={'3rem'}>Choose a difficulty</Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ width: '100%' }}>
                <Grid item xs={3} sm={3} md={1.5}>{DifficultyCard('Easy')}</Grid>
                <Grid item xs={3} sm={3} md={1.5}>{DifficultyCard('Medium')}</Grid>
                <Grid item xs={3} sm={3} md={1.5}>{DifficultyCard('Hard')}</Grid>
            </Grid>
        </Box>
    )
  }

  return (
    <Box>
        <DifficultyCards />
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

export default DifficultySelection
