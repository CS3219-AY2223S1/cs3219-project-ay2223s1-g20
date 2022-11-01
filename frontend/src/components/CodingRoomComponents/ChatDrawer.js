import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Drawer,
  Toolbar
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { TextInput } from '../Chat/Input'
import { MessageLeft, MessageRight } from '../Chat/Message'
import { getMatchId, getUsername } from '../../api/cookieApi'
import { getChatSocket } from '../../api/socketApi'
import { START_CHAT, RCV_MSG, SEND_MSG } from '../../util/constants'

const drawerWidth = '25vw'

const theme = createTheme({
  paper: {
    width: drawerWidth,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    position: 'relative'
  },
  container: {
    width: drawerWidth,
    paddingTop: '0vh',
    height: '86vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesBody: {
    width: 'calc( 100% - 20px )',
    margin: 10,
    overflowY: 'scroll',
    height: '100%'
  }
})

function ChatDrawer () {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      { username: 'hazeltan2', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan2', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' },
      { username: 'hazeltan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta.' }
    ])
  }, [])

  useEffect(() => {
    const chatSocket = getChatSocket()
    chatSocket.emit(START_CHAT, { roomId: getMatchId(), username: getUsername() })
    chatSocket.on(RCV_MSG, handleNewMessage)
  }, [])

  const handleNewMessage = useCallback((message) => {
    // TODO: event not received due to BE error.
    console.log('handle new message')
    setMessages([...messages, message])
  }, [])

  const sendNewMessage = (message) => {
    getChatSocket().emit(SEND_MSG, { username: getUsername(), message: message })
  }

  const BottomTextInput = () => {
    return (
        <Box sx={{ position: 'fixed', left: '76.5vw', bottom: 0, right: 0 }} bgcolor="transparent" display={'flex'} justifyContent="center" alignItems="center" m={1} width={'22vw'}>
          <TextInput onSubmit={sendNewMessage}/>
        </Box>
    )
  }

  const Chat = () => {
    return (
      <ThemeProvider theme={theme}>
        <div style={theme.container}>
          <Paper elevation={0} style={theme.paper} zDepth={2}>
            <Paper elevation={0} id='style-1' style={theme.messagesBody}>
              {
                messages.map((item, index) => {
                  if (item.username === getUsername()) {
                    return (<MessageRight
                      key={ index }
                      message={ item.message }
                      displayName={ item.username }
                    />)
                  } else {
                    return (<MessageLeft
                      key={ index }
                      message={ item.message }
                      displayName={ item.username }
                    />)
                  }
                })
              }
            </Paper>
          </Paper>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <Drawer
    variant='permanent'
    anchor='right'
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
    }}
    >
        <Toolbar />
        <Chat />
        <BottomTextInput />
    </Drawer>
  )
}

export default ChatDrawer
