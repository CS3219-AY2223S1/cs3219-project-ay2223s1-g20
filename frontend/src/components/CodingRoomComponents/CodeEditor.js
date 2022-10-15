import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { getCollabSocket } from '../../api/socketApi'
import { javascript } from '@codemirror/lang-javascript'

function Editor (props) {
  const [code, setCode] = useState('console.log(\'hello world!\');')
  useEffect(() => {
    startCollabSession()
  }, [])

  const startCollabSession = () => {
    const collabSocket = getCollabSocket()
    collabSocket.on('updateChanges', handleUpdateCode)
  }

  const handleUpdateCode = useCallback((code) => {
    setCode(code)
  }, [])

  const onChange = React.useCallback((value, viewUpdate) => {
    getCollabSocket().emit('sendChanges', value)
  }, [])

  const BottomBar = () => {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.drawer - 1 }}>
        <Box display={'flex'} justifyContent="center" alignItems="center" m={1}>
          <Button variant={'contained'} onClick={props.handleOnClick}>Leave Room</Button>
        </Box>
      </Paper>
    )
  }

  return (
    <Box height={'100%'} width={'100%'}>
      <CodeMirror
        value={code}
        height="85vh"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />

      <BottomBar />
    </Box>

  )
}

export default Editor
