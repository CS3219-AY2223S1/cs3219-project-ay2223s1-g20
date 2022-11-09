import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { getCollabSocket, setCollabSocket } from '../../api/socketApi'
import { javascript } from '@codemirror/lang-javascript'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'
import { grey, blue } from '@mui/material/colors'
import debounce from 'lodash.debounce'
import moment from 'moment-timezone'
import { getUsername } from '../../api/cookieApi'

function Editor (props) {
  const [lastVersion, setLastVersion] = useState('')
  const [store, setStore] = useState('')
  const [code, setCode] = useState('//code here')
  const [version, setVersion] = useState(moment().tz('Asia/Singapore').format('MM/DD/YYYY h:mm:ss:SSS'))
  const [block, setBlock] = useState(false)
  const [userChanged, setUserChanged] = useState(true)

  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

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

  const handleUpdateCode = useCallback((payload) => {
    // console.log(payload)
    setLastVersion(payload.version)
    if (payload.username !== getUsername()) {
      console.log(payload.code)
      setCode(payload.code)
      setStore(payload.code)
      setVersion(payload.version)
      setUserChanged(false)
    }
  }, [])

  const changeHandler = (value) => {
    sleep(1000)
    console.log('hi: ', value)
    console.log(store)
    const currVersion = moment().tz('Asia/Singapore').format('MM/DD/YYYY h:mm:ss:SSS')
    if (value !== store && currVersion > lastVersion) {
      console.log('sending to backend')
      getCollabSocket().emit('sendChanges', {version: currVersion, code: value, username: getUsername()})
    }
  }

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 300);
  }, []);

  const onStatistics = useCallback((data) => {
    //console.log(data)
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
