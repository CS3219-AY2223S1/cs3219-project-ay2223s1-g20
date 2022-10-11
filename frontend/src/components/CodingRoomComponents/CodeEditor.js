import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'
import CodeMirror from 'codemirror'

function Editor (props) {
  useEffect(() => {
    const editor = CodeMirror.fromTextArea(document.getElementById('ds'), {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript'
    })

    editor.on('cursorActivity', (instance) => {
      console.log(instance.cursorCoords())
    })
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
      <textarea id="ds" />
      {/* <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={10}
        style={{
          height: '100%',
          width: '100%',
          fontSize: 12,
          backgroundColor: '#f5f5f5',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
        }}
      /> */}
      <BottomBar />
    </Box>

  )
}

export default Editor
