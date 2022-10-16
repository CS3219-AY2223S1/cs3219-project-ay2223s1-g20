import React from 'react'
import {
  Drawer,
  Toolbar
} from '@mui/material'

function ChatDrawer () {
  const drawerWidth = '25vw'
  return (
    <Drawer
    variant="permanent"
    anchor="right"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
    }}
    >
        <Toolbar />
        Chat here
    </Drawer>
  )
}

export default ChatDrawer
