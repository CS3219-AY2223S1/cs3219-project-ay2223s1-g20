import React from 'react'
import { Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { deepOrange, grey, blue } from '@mui/material/colors'
import { ThemeProvider } from '@emotion/react'

const theme = createTheme({
  messageRow: {
    display: 'flex'
  },
  messageRowRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  messageLeft: {
    position: 'relative',
    marginLeft: '20px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: grey[300],
    width: '60%',
    textAlign: 'left',
    font: "400 .9em 'Open Sans', sans-serif",
    borderRadius: '0px 20px 20px 20px',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '15px solid #A8DDFD',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      top: '0',
      left: '-15px'
    },
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '17px solid #97C6E3',
      borderLeft: '16px solid transparent',
      borderRight: '16px solid transparent',
      top: '-1px',
      left: '-17px'
    }
  },
  messageRight: {
    position: 'relative',
    marginRight: '20px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: blue[500],
    color: grey[50],
    width: '60%',
    textAlign: 'left',
    font: "400 .9em 'Open Sans', sans-serif",
    borderRadius: '20px 20px 0px 20px',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '15px solid #f8e896',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      top: '0',
      right: '-15px'
    },
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '17px solid #dfd087',
      borderLeft: '16px solid transparent',
      borderRight: '16px solid transparent',
      top: '-1px',
      right: '-17px'
    }
  },
  messageContent: {
    padding: 0,
    margin: 0
  },
  orange: {
    color: 'deepOrange',
    backgroundColor: deepOrange[500],
    width: '16px',
    height: '16px'
  },
  displayName: {
    marginLeft: '20px'
  }
})

export const MessageLeft = (props) => {
  const message = props.message ? props.message : 'no message'
  const displayName = props.displayName ? props.displayName : '名無しさん'
  return (
    <ThemeProvider theme={theme}>
      <div style={theme.messageRow}>
        <div>
          <div style={theme.displayName}>
            <Typography variant={'body'}
              sx={{ fontSize: '0.8rem', fontFamily: 'Poppins' }}>
              {displayName}
            </Typography>
          </div>
          <div style={theme.messageLeft}>
            <div>
              <p style={theme.messageContent}>
              <Typography variant={'body'} sx={{ fontSize: '0.9rem', fontFamily: 'Source Sans Pro' }}>
                {message}
              </Typography>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export const MessageRight = (props) => {
  const message = props.message ? props.message : 'no message'
  return (
    <ThemeProvider theme={theme}>
      <div style={theme.messageRowRight}>
        <div style={theme.messageRight}>
          <p style={theme.messageContent}>
              <Typography variant={'body'} sx={{ fontSize: '0.9rem', fontFamily: 'Source Sans Pro' }}>
                {message}
              </Typography>
          </p>
        </div>
      </div>
    </ThemeProvider>
  )
}
