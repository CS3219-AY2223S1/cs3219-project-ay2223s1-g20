import React from 'react'
import {
  Button,
  TextField
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { ThemeProvider } from '@emotion/react'

const theme = createTheme({
  wrapForm: {
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    margin: 'auto'
  },
  wrapText: {
    width: '20vw'
  }
})

export const TextInput = () => {
  return (
    <ThemeProvider theme={theme}>
      <form style={theme.wrapForm} noValidate autoComplete='off'>
        <TextField
          size="small"
          id='standard-text'
          style={theme.wrapText}
        />
        <Button variant='text' color='primary'>
          <SendIcon />
        </Button>
      </form>
    </ThemeProvider>
  )
}
