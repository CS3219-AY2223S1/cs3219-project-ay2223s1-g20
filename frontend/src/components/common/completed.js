import * as React from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

export default function Completed ({ type, text }) {
  const imgUrl = (type === 'success') ? './static/tick.png' : './static/cross.png'
  return (
    <Box display="flex" flexDirection={'column'} alignItems="center" sx={{ p: 1, minWidth: '40vw' }}>
      <Box
        component="img"
        sx={{ height: '10rem' }}
        alt="tick"
        src={imgUrl}
      />
      <Typography variant={'h3'} class={'poppins'}>{text}</Typography>
    </Box>
  )
}
