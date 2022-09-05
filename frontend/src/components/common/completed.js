import * as React from 'react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function Completed({text}) {
  return (
    <Box display="flex" flexDirection={"column"} alignItems="center" sx={{p:1, minWidth: '40vw'}}>
      <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 100 }}/>
      <Typography variant={"h3"} class={"poppins"}>{text}</Typography>
    </Box>
  );
}