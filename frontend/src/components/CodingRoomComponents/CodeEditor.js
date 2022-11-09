import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { getCollabSocket } from '../../api/socketApi'
import { javascript } from '@codemirror/lang-javascript'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'
import { grey, blue } from '@mui/material/colors'
import debounce from 'lodash.debounce'
import moment from 'moment-timezone'
import { getUsername } from '../../api/cookieApi'

function Editor (props) {
  const [code, setCode] = useState('console.log(\'hello world!\');')
  const [version, setVersion] = useState(moment().tz('Asia/Singapore').format('MM/DD/YYYY h:mm:ss:SSS'))
  const [lastPayloadCode, setLastPayloadCode] = useState('')

  const buttonTheme = createTheme({
    palette: {
      primary: {
        main: blue[500],
        contrastText: grey[50]
      }
    }
  })

  const BottomBar = () => {
    return (

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.drawer - 1 }}>
        <Box display={'flex'} justifyContent="center" alignItems="center" m={1}>
          <ThemeProvider theme={buttonTheme}>
            <Button variant={'contained'} onClick={props.handleOnClick}>Leave Room</Button>
          </ThemeProvider>
        </Box>
      </Paper>
    )
  }

  useEffect(() => {
    startCollabSession()
    setVersion(moment().tz('Asia/Singapore').format('MM/DD/YYYY h:mm:ss:SSS'))
  }, [])

  const startCollabSession = () => {
    const collabSocket = getCollabSocket()
    collabSocket.on('updateChanges', handleUpdateCode)
  }

  useEffect(() => {
    console.log('last: ', lastPayloadCode)
  }, [lastPayloadCode])

  const handleUpdateCode = useCallback((payload) => {
    if (payload.version >= version) {
      console.log('updating..')
      const payloadCode = payload.value
      console.log(payload.value)
      setLastPayloadCode(payloadCode)
      setCode(payload.value)
      setVersion(payload.version)
    }
  }, [])

  const sendUpdate = (value) => {
    const currentVersion = moment().tz('Asia/Singapore').format('MM/DD/YYYY h:mm:ss:SSS')
    if (currentVersion > version) {
      console.log('bigger version and code different, sending event...')
      setVersion(currentVersion)
      getCollabSocket().emit('sendChanges', {version: currentVersion, value: value, username: getUsername()})
    }
  }

  const changeHandler = (value) => {
    if (lastPayloadCode !== code) {
      console.log(lastPayloadCode)
      console.log(code)
      sendUpdate(value)
    }
  }

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 50);
  }, []);

  const onStatistics = useCallback((data) => {
    // console.log(data)
  }, [])

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, []);

  return (
    <Box height={'100%'} width={'100%'}>
      <CodeMirror
        id={'editor'}
        value={code}
        height="85vh"
        extensions={[javascript({ jsx: true })]}
        onChange={debouncedChangeHandler}
        onStatistics={onStatistics}
      />

      <BottomBar />
    </Box>

  )
}

export default Editor
