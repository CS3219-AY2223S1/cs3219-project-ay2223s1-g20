import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Loading (props) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress size={props.size ? props.size : 40}/>
    </Box>
  )
}
