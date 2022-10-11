import React from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

function Editor (props) {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log('value changed')
    // add code to send to collab service here
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
        value="console.log('hello world!');"
        height="85vh"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />

      <BottomBar />
    </Box>

  )
}

export default Editor
