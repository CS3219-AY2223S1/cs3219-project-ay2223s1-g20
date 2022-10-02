import CodeEditor from '@uiw/react-textarea-code-editor'
import React from 'react'
import {
  Box,
  Button,
  Paper
} from '@mui/material'

function Editor (props) {
  const [code, setCode] = React.useState(
    'function add(a, b) {\n  return a + b;\n}'
  )

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
      <CodeEditor
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
      />
      <BottomBar />
    </Box>

  )
}

export default Editor
