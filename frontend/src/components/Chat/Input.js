import React, { useState } from 'react'
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

export const TextInput = (props) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    props.onSubmit(message)
  }

  return (
    <ThemeProvider theme={theme}>
      <form style={theme.wrapForm} noValidate autoComplete='off'>
        <TextField
          size="small"
          id='standard-text'
          style={theme.wrapText}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant='text' color='primary' onClick={handleSubmit}>
          <SendIcon />
        </Button>
      </form>
    </ThemeProvider>
  )
}
